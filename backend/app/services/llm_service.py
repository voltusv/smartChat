"""
LLM Service

Handles communication with LLM providers (OpenAI, etc.)
Supports streaming, function calling, and tool use.
"""

import json
from collections.abc import AsyncGenerator
from typing import Any

import openai


class LLMService:
    def __init__(
        self,
        api_key: str,
        model: str = "gpt-4o-mini",
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ):
        self.client = openai.AsyncOpenAI(api_key=api_key)
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens

    async def chat_stream(
        self, 
        messages: list[dict], 
        tools: list[dict] = None
    ) -> AsyncGenerator[dict, None]:
        """
        Stream chat completion with optional tool support.
        
        Yields dicts with:
        - {"type": "content", "content": "text"} for regular content
        - {"type": "tool_call", "tool_calls": [...]} when LLM wants to call tools
        - {"type": "done"} when complete
        """
        kwargs = {
            "model": self.model,
            "messages": messages,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
            "stream": True,
        }
        
        if tools:
            kwargs["tools"] = tools
            kwargs["tool_choice"] = "auto"
        
        stream = await self.client.chat.completions.create(**kwargs)
        
        # Accumulate tool calls while streaming
        tool_calls_buffer = {}
        
        async for chunk in stream:
            delta = chunk.choices[0].delta if chunk.choices else None
            
            if not delta:
                continue
            
            # Handle regular content
            if delta.content:
                yield {"type": "content", "content": delta.content}
            
            # Handle tool calls (streamed in chunks)
            if delta.tool_calls:
                for tc in delta.tool_calls:
                    idx = tc.index
                    if idx not in tool_calls_buffer:
                        tool_calls_buffer[idx] = {
                            "id": tc.id or "",
                            "type": "function",
                            "function": {"name": "", "arguments": ""}
                        }
                    
                    if tc.id:
                        tool_calls_buffer[idx]["id"] = tc.id
                    if tc.function:
                        if tc.function.name:
                            tool_calls_buffer[idx]["function"]["name"] = tc.function.name
                        if tc.function.arguments:
                            tool_calls_buffer[idx]["function"]["arguments"] += tc.function.arguments
            
            # Check for finish reason
            if chunk.choices[0].finish_reason:
                if chunk.choices[0].finish_reason == "tool_calls" and tool_calls_buffer:
                    # Return accumulated tool calls
                    yield {
                        "type": "tool_call",
                        "tool_calls": list(tool_calls_buffer.values())
                    }
                break
        
        yield {"type": "done"}

    async def chat(
        self, 
        messages: list[dict], 
        tools: list[dict] = None
    ) -> dict:
        """
        Non-streaming chat completion.
        
        Returns:
        {
            "content": "response text",
            "tool_calls": [...] or None
        }
        """
        kwargs = {
            "model": self.model,
            "messages": messages,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
        }
        
        if tools:
            kwargs["tools"] = tools
            kwargs["tool_choice"] = "auto"
        
        response = await self.client.chat.completions.create(**kwargs)
        message = response.choices[0].message
        
        result = {
            "content": message.content or "",
            "tool_calls": None
        }
        
        if message.tool_calls:
            result["tool_calls"] = [
                {
                    "id": tc.id,
                    "type": "function",
                    "function": {
                        "name": tc.function.name,
                        "arguments": tc.function.arguments
                    }
                }
                for tc in message.tool_calls
            ]
        
        return result

    async def chat_with_tools(
        self,
        messages: list[dict],
        tools: list[dict],
        execute_tool_fn,
        max_iterations: int = 5
    ) -> AsyncGenerator[str, None]:
        """
        Chat with automatic tool execution loop.
        
        Handles the full cycle of:
        1. Send message to LLM
        2. If LLM calls tools, execute them
        3. Send results back to LLM
        4. Repeat until LLM gives final response
        
        Args:
            messages: Conversation messages
            tools: Available tools in OpenAI format
            execute_tool_fn: async function(tool_name, arguments) -> str
            max_iterations: Max tool call iterations to prevent infinite loops
            
        Yields:
            Text chunks of the final response
        """
        current_messages = messages.copy()
        iterations = 0
        
        while iterations < max_iterations:
            iterations += 1
            
            # Stream response
            full_content = ""
            tool_calls = None
            
            async for chunk in self.chat_stream(current_messages, tools):
                if chunk["type"] == "content":
                    full_content += chunk["content"]
                    yield chunk["content"]
                elif chunk["type"] == "tool_call":
                    tool_calls = chunk["tool_calls"]
                elif chunk["type"] == "done":
                    break
            
            # If no tool calls, we're done
            if not tool_calls:
                return
            
            # Add assistant message with tool calls
            current_messages.append({
                "role": "assistant",
                "content": full_content or None,
                "tool_calls": tool_calls
            })
            
            # Execute each tool and add results
            for tc in tool_calls:
                tool_name = tc["function"]["name"]
                try:
                    args = json.loads(tc["function"]["arguments"])
                except json.JSONDecodeError:
                    args = {}
                
                # Execute the tool
                result = await execute_tool_fn(tool_name, args)
                
                current_messages.append({
                    "role": "tool",
                    "tool_call_id": tc["id"],
                    "content": result
                })
            
            # Continue the loop to get LLM's response to tool results
        
        # If we hit max iterations, yield a warning
        yield "\n[Maximum tool iterations reached]"

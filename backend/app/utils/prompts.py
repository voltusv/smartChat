def build_rag_messages(
    system_prompt: str,
    retrieved_chunks: list[dict],
    conversation_history: list[dict],
    user_message: str,
) -> list[dict]:
    context_text = "\n\n---\n\n".join([c["content"] for c in retrieved_chunks])

    system_content = system_prompt
    if context_text:
        system_content += (
            "\n\nUse the following information from the knowledge base to answer the user's question. "
            "If the information doesn't contain the answer, say so honestly.\n\n"
            f"--- Knowledge Base ---\n{context_text}\n--- End ---"
        )

    messages = [{"role": "system", "content": system_content}]
    messages.extend(conversation_history)
    messages.append({"role": "user", "content": user_message})
    return messages

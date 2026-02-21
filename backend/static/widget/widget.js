(()=>{var Oe=class{constructor(e,t){let i=e.startsWith("https")?"wss":"ws",s=e.replace(/^https?:\/\//,"");this.url=`${i}://${s}/api/chat/ws/chat/${t}`,this.ws=null,this.onChunk=null,this.onDone=null,this.onError=null,this.onOpen=null,this._reconnectTimer=null,this._intentionalClose=!1}connect(){this._intentionalClose=!1,this.ws=new WebSocket(this.url),this.ws.onopen=()=>{this.onOpen&&this.onOpen()},this.ws.onmessage=e=>{try{let t=JSON.parse(e.data);t.type==="chunk"&&this.onChunk?this.onChunk(t.content):t.type==="done"&&this.onDone?this.onDone():t.type==="error"&&this.onError&&this.onError(t.message)}catch(t){console.error("SmartChat: Failed to parse message",t)}},this.ws.onclose=()=>{this._intentionalClose||(this._reconnectTimer=setTimeout(()=>this.connect(),2e3))},this.ws.onerror=e=>{console.error("SmartChat: WebSocket error",e)}}send(e,t){return this.ws&&this.ws.readyState===WebSocket.OPEN?(this.ws.send(JSON.stringify({message:e,api_key:t})),!0):!1}disconnect(){this._intentionalClose=!0,this._reconnectTimer&&clearTimeout(this._reconnectTimer),this.ws&&this.ws.close()}};function ct(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var ne=ct();function rn(n){ne=n}var me={exec:()=>null};function x(n,e=""){let t=typeof n=="string"?n:n.source,i={replace:(s,o)=>{let a=typeof o=="string"?o:o.source;return a=a.replace(O.caret,"$1"),t=t.replace(s,a),i},getRegex:()=>new RegExp(t,e)};return i}var O={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:n=>new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:n=>new RegExp(`^ {0,${Math.min(3,n-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:n=>new RegExp(`^ {0,${Math.min(3,n-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:n=>new RegExp(`^ {0,${Math.min(3,n-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:n=>new RegExp(`^ {0,${Math.min(3,n-1)}}#`),htmlBeginRegex:n=>new RegExp(`^ {0,${Math.min(3,n-1)}}<(?:[a-z].*>|!--)`,"i")},Zn=/^(?:[ \t]*(?:\n|$))+/,Yn=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Xn=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,be=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Vn=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,pt=/(?:[*+-]|\d{1,9}[.)])/,on=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,an=x(on).replace(/bull/g,pt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Qn=x(on).replace(/bull/g,pt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),ut=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Kn=/^[^\n]+/,ht=/(?!\s*\])(?:\\.|[^\[\]\\])+/,Jn=x(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",ht).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),es=x(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,pt).getRegex(),$e="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",dt=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ts=x("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",dt).replace("tag",$e).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),ln=x(ut).replace("hr",be).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",$e).getRegex(),ns=x(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",ln).getRegex(),ft={blockquote:ns,code:Yn,def:Jn,fences:Xn,heading:Vn,hr:be,html:ts,lheading:an,list:es,newline:Zn,paragraph:ln,table:me,text:Kn},Jt=x("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",be).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",$e).getRegex(),ss={...ft,lheading:Qn,table:Jt,paragraph:x(ut).replace("hr",be).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Jt).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",$e).getRegex()},is={...ft,html:x(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",dt).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:me,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:x(ut).replace("hr",be).replace("heading",` *#{1,6} *[^
]`).replace("lheading",an).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},rs=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,os=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,cn=/^( {2,}|\\)\n(?!\s*$)/,as=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Be=/[\p{P}\p{S}]/u,gt=/[\s\p{P}\p{S}]/u,pn=/[^\s\p{P}\p{S}]/u,ls=x(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,gt).getRegex(),un=/(?!~)[\p{P}\p{S}]/u,cs=/(?!~)[\s\p{P}\p{S}]/u,ps=/(?:[^\s\p{P}\p{S}]|~)/u,us=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,hn=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,hs=x(hn,"u").replace(/punct/g,Be).getRegex(),ds=x(hn,"u").replace(/punct/g,un).getRegex(),dn="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",fs=x(dn,"gu").replace(/notPunctSpace/g,pn).replace(/punctSpace/g,gt).replace(/punct/g,Be).getRegex(),gs=x(dn,"gu").replace(/notPunctSpace/g,ps).replace(/punctSpace/g,cs).replace(/punct/g,un).getRegex(),ms=x("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,pn).replace(/punctSpace/g,gt).replace(/punct/g,Be).getRegex(),bs=x(/\\(punct)/,"gu").replace(/punct/g,Be).getRegex(),ks=x(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),xs=x(dt).replace("(?:-->|$)","-->").getRegex(),ws=x("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",xs).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ne=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,Ts=x(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",Ne).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),fn=x(/^!?\[(label)\]\[(ref)\]/).replace("label",Ne).replace("ref",ht).getRegex(),gn=x(/^!?\[(ref)\](?:\[\])?/).replace("ref",ht).getRegex(),_s=x("reflink|nolink(?!\\()","g").replace("reflink",fn).replace("nolink",gn).getRegex(),mt={_backpedal:me,anyPunctuation:bs,autolink:ks,blockSkip:us,br:cn,code:os,del:me,emStrongLDelim:hs,emStrongRDelimAst:fs,emStrongRDelimUnd:ms,escape:rs,link:Ts,nolink:gn,punctuation:ls,reflink:fn,reflinkSearch:_s,tag:ws,text:as,url:me},Es={...mt,link:x(/^!?\[(label)\]\((.*?)\)/).replace("label",Ne).getRegex(),reflink:x(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ne).getRegex()},ot={...mt,emStrongRDelimAst:gs,emStrongLDelim:ds,url:x(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},ys={...ot,br:x(cn).replace("{2,}","*").getRegex(),text:x(ot.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},De={normal:ft,gfm:ss,pedantic:is},fe={normal:mt,gfm:ot,breaks:ys,pedantic:Es},Ss={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},en=n=>Ss[n];function H(n,e){if(e){if(O.escapeTest.test(n))return n.replace(O.escapeReplace,en)}else if(O.escapeTestNoEncode.test(n))return n.replace(O.escapeReplaceNoEncode,en);return n}function tn(n){try{n=encodeURI(n).replace(O.percentDecode,"%")}catch{return null}return n}function nn(n,e){let t=n.replace(O.findPipe,(o,a,l)=>{let u=!1,p=a;for(;--p>=0&&l[p]==="\\";)u=!u;return u?"|":" |"}),i=t.split(O.splitPipe),s=0;if(i[0].trim()||i.shift(),i.length>0&&!i.at(-1)?.trim()&&i.pop(),e)if(i.length>e)i.splice(e);else for(;i.length<e;)i.push("");for(;s<i.length;s++)i[s]=i[s].trim().replace(O.slashPipe,"|");return i}function ge(n,e,t){let i=n.length;if(i===0)return"";let s=0;for(;s<i;){let o=n.charAt(i-s-1);if(o===e&&!t)s++;else if(o!==e&&t)s++;else break}return n.slice(0,i-s)}function As(n,e){if(n.indexOf(e[1])===-1)return-1;let t=0;for(let i=0;i<n.length;i++)if(n[i]==="\\")i++;else if(n[i]===e[0])t++;else if(n[i]===e[1]&&(t--,t<0))return i;return t>0?-2:-1}function sn(n,e,t,i,s){let o=e.href,a=e.title||null,l=n[1].replace(s.other.outputLinkReplace,"$1");i.state.inLink=!0;let u={type:n[0].charAt(0)==="!"?"image":"link",raw:t,href:o,title:a,text:l,tokens:i.inlineTokens(l)};return i.state.inLink=!1,u}function Rs(n,e,t){let i=n.match(t.other.indentCodeCompensation);if(i===null)return e;let s=i[1];return e.split(`
`).map(o=>{let a=o.match(t.other.beginningSpace);if(a===null)return o;let[l]=a;return l.length>=s.length?o.slice(s.length):o}).join(`
`)}var Pe=class{options;rules;lexer;constructor(n){this.options=n||ne}space(n){let e=this.rules.block.newline.exec(n);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(n){let e=this.rules.block.code.exec(n);if(e){let t=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?t:ge(t,`
`)}}}fences(n){let e=this.rules.block.fences.exec(n);if(e){let t=e[0],i=Rs(t,e[3]||"",this.rules);return{type:"code",raw:t,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:i}}}heading(n){let e=this.rules.block.heading.exec(n);if(e){let t=e[2].trim();if(this.rules.other.endingHash.test(t)){let i=ge(t,"#");(this.options.pedantic||!i||this.rules.other.endingSpaceChar.test(i))&&(t=i.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:t,tokens:this.lexer.inline(t)}}}hr(n){let e=this.rules.block.hr.exec(n);if(e)return{type:"hr",raw:ge(e[0],`
`)}}blockquote(n){let e=this.rules.block.blockquote.exec(n);if(e){let t=ge(e[0],`
`).split(`
`),i="",s="",o=[];for(;t.length>0;){let a=!1,l=[],u;for(u=0;u<t.length;u++)if(this.rules.other.blockquoteStart.test(t[u]))l.push(t[u]),a=!0;else if(!a)l.push(t[u]);else break;t=t.slice(u);let p=l.join(`
`),f=p.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");i=i?`${i}
${p}`:p,s=s?`${s}
${f}`:f;let w=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(f,o,!0),this.lexer.state.top=w,t.length===0)break;let m=o.at(-1);if(m?.type==="code")break;if(m?.type==="blockquote"){let E=m,k=E.raw+`
`+t.join(`
`),P=this.blockquote(k);o[o.length-1]=P,i=i.substring(0,i.length-E.raw.length)+P.raw,s=s.substring(0,s.length-E.text.length)+P.text;break}else if(m?.type==="list"){let E=m,k=E.raw+`
`+t.join(`
`),P=this.list(k);o[o.length-1]=P,i=i.substring(0,i.length-m.raw.length)+P.raw,s=s.substring(0,s.length-E.raw.length)+P.raw,t=k.substring(o.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:i,tokens:o,text:s}}}list(n){let e=this.rules.block.list.exec(n);if(e){let t=e[1].trim(),i=t.length>1,s={type:"list",raw:"",ordered:i,start:i?+t.slice(0,-1):"",loose:!1,items:[]};t=i?`\\d{1,9}\\${t.slice(-1)}`:`\\${t}`,this.options.pedantic&&(t=i?t:"[*+-]");let o=this.rules.other.listItemRegex(t),a=!1;for(;n;){let u=!1,p="",f="";if(!(e=o.exec(n))||this.rules.block.hr.test(n))break;p=e[0],n=n.substring(p.length);let w=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,pe=>" ".repeat(3*pe.length)),m=n.split(`
`,1)[0],E=!w.trim(),k=0;if(this.options.pedantic?(k=2,f=w.trimStart()):E?k=e[1].length+1:(k=e[2].search(this.rules.other.nonSpaceChar),k=k>4?1:k,f=w.slice(k),k+=e[1].length),E&&this.rules.other.blankLine.test(m)&&(p+=m+`
`,n=n.substring(m.length+1),u=!0),!u){let pe=this.rules.other.nextBulletRegex(k),ye=this.rules.other.hrRegex(k),X=this.rules.other.fencesBeginRegex(k),A=this.rules.other.headingBeginRegex(k),V=this.rules.other.htmlBeginRegex(k);for(;n;){let Q=n.split(`
`,1)[0],K;if(m=Q,this.options.pedantic?(m=m.replace(this.rules.other.listReplaceNesting,"  "),K=m):K=m.replace(this.rules.other.tabCharGlobal,"    "),X.test(m)||A.test(m)||V.test(m)||pe.test(m)||ye.test(m))break;if(K.search(this.rules.other.nonSpaceChar)>=k||!m.trim())f+=`
`+K.slice(k);else{if(E||w.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||X.test(w)||A.test(w)||ye.test(w))break;f+=`
`+m}!E&&!m.trim()&&(E=!0),p+=Q+`
`,n=n.substring(Q.length+1),w=K.slice(k)}}s.loose||(a?s.loose=!0:this.rules.other.doubleBlankLine.test(p)&&(a=!0));let P=null,Ee;this.options.gfm&&(P=this.rules.other.listIsTask.exec(f),P&&(Ee=P[0]!=="[ ] ",f=f.replace(this.rules.other.listReplaceTask,""))),s.items.push({type:"list_item",raw:p,task:!!P,checked:Ee,loose:!1,text:f,tokens:[]}),s.raw+=p}let l=s.items.at(-1);if(l)l.raw=l.raw.trimEnd(),l.text=l.text.trimEnd();else return;s.raw=s.raw.trimEnd();for(let u=0;u<s.items.length;u++)if(this.lexer.state.top=!1,s.items[u].tokens=this.lexer.blockTokens(s.items[u].text,[]),!s.loose){let p=s.items[u].tokens.filter(w=>w.type==="space"),f=p.length>0&&p.some(w=>this.rules.other.anyLine.test(w.raw));s.loose=f}if(s.loose)for(let u=0;u<s.items.length;u++)s.items[u].loose=!0;return s}}html(n){let e=this.rules.block.html.exec(n);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(n){let e=this.rules.block.def.exec(n);if(e){let t=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),i=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",s=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:t,raw:e[0],href:i,title:s}}}table(n){let e=this.rules.block.table.exec(n);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let t=nn(e[1]),i=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),s=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],o={type:"table",raw:e[0],header:[],align:[],rows:[]};if(t.length===i.length){for(let a of i)this.rules.other.tableAlignRight.test(a)?o.align.push("right"):this.rules.other.tableAlignCenter.test(a)?o.align.push("center"):this.rules.other.tableAlignLeft.test(a)?o.align.push("left"):o.align.push(null);for(let a=0;a<t.length;a++)o.header.push({text:t[a],tokens:this.lexer.inline(t[a]),header:!0,align:o.align[a]});for(let a of s)o.rows.push(nn(a,o.header.length).map((l,u)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:o.align[u]})));return o}}lheading(n){let e=this.rules.block.lheading.exec(n);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(n){let e=this.rules.block.paragraph.exec(n);if(e){let t=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:t,tokens:this.lexer.inline(t)}}}text(n){let e=this.rules.block.text.exec(n);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(n){let e=this.rules.inline.escape.exec(n);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(n){let e=this.rules.inline.tag.exec(n);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(n){let e=this.rules.inline.link.exec(n);if(e){let t=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(t)){if(!this.rules.other.endAngleBracket.test(t))return;let o=ge(t.slice(0,-1),"\\");if((t.length-o.length)%2===0)return}else{let o=As(e[2],"()");if(o===-2)return;if(o>-1){let l=(e[0].indexOf("!")===0?5:4)+e[1].length+o;e[2]=e[2].substring(0,o),e[0]=e[0].substring(0,l).trim(),e[3]=""}}let i=e[2],s="";if(this.options.pedantic){let o=this.rules.other.pedanticHrefTitle.exec(i);o&&(i=o[1],s=o[3])}else s=e[3]?e[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(t)?i=i.slice(1):i=i.slice(1,-1)),sn(e,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:s&&s.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(n,e){let t;if((t=this.rules.inline.reflink.exec(n))||(t=this.rules.inline.nolink.exec(n))){let i=(t[2]||t[1]).replace(this.rules.other.multipleSpaceGlobal," "),s=e[i.toLowerCase()];if(!s){let o=t[0].charAt(0);return{type:"text",raw:o,text:o}}return sn(t,s,t[0],this.lexer,this.rules)}}emStrong(n,e,t=""){let i=this.rules.inline.emStrongLDelim.exec(n);if(!i||i[3]&&t.match(this.rules.other.unicodeAlphaNumeric))return;if(!(i[1]||i[2]||"")||!t||this.rules.inline.punctuation.exec(t)){let o=[...i[0]].length-1,a,l,u=o,p=0,f=i[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(f.lastIndex=0,e=e.slice(-1*n.length+o);(i=f.exec(e))!=null;){if(a=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!a)continue;if(l=[...a].length,i[3]||i[4]){u+=l;continue}else if((i[5]||i[6])&&o%3&&!((o+l)%3)){p+=l;continue}if(u-=l,u>0)continue;l=Math.min(l,l+u+p);let w=[...i[0]][0].length,m=n.slice(0,o+i.index+w+l);if(Math.min(o,l)%2){let k=m.slice(1,-1);return{type:"em",raw:m,text:k,tokens:this.lexer.inlineTokens(k)}}let E=m.slice(2,-2);return{type:"strong",raw:m,text:E,tokens:this.lexer.inlineTokens(E)}}}}codespan(n){let e=this.rules.inline.code.exec(n);if(e){let t=e[2].replace(this.rules.other.newLineCharGlobal," "),i=this.rules.other.nonSpaceChar.test(t),s=this.rules.other.startingSpaceChar.test(t)&&this.rules.other.endingSpaceChar.test(t);return i&&s&&(t=t.substring(1,t.length-1)),{type:"codespan",raw:e[0],text:t}}}br(n){let e=this.rules.inline.br.exec(n);if(e)return{type:"br",raw:e[0]}}del(n){let e=this.rules.inline.del.exec(n);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(n){let e=this.rules.inline.autolink.exec(n);if(e){let t,i;return e[2]==="@"?(t=e[1],i="mailto:"+t):(t=e[1],i=t),{type:"link",raw:e[0],text:t,href:i,tokens:[{type:"text",raw:t,text:t}]}}}url(n){let e;if(e=this.rules.inline.url.exec(n)){let t,i;if(e[2]==="@")t=e[0],i="mailto:"+t;else{let s;do s=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(s!==e[0]);t=e[0],e[1]==="www."?i="http://"+e[0]:i=e[0]}return{type:"link",raw:e[0],text:t,href:i,tokens:[{type:"text",raw:t,text:t}]}}}inlineText(n){let e=this.rules.inline.text.exec(n);if(e){let t=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:t}}}},Z=class at{tokens;options;state;tokenizer;inlineQueue;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||ne,this.options.tokenizer=this.options.tokenizer||new Pe,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let t={other:O,block:De.normal,inline:fe.normal};this.options.pedantic?(t.block=De.pedantic,t.inline=fe.pedantic):this.options.gfm&&(t.block=De.gfm,this.options.breaks?t.inline=fe.breaks:t.inline=fe.gfm),this.tokenizer.rules=t}static get rules(){return{block:De,inline:fe}}static lex(e,t){return new at(t).lex(e)}static lexInline(e,t){return new at(t).inlineTokens(e)}lex(e){e=e.replace(O.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){let i=this.inlineQueue[t];this.inlineTokens(i.src,i.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],i=!1){for(this.options.pedantic&&(e=e.replace(O.tabCharGlobal,"    ").replace(O.spaceLine,""));e;){let s;if(this.options.extensions?.block?.some(a=>(s=a.call({lexer:this},e,t))?(e=e.substring(s.raw.length),t.push(s),!0):!1))continue;if(s=this.tokenizer.space(e)){e=e.substring(s.raw.length);let a=t.at(-1);s.raw.length===1&&a!==void 0?a.raw+=`
`:t.push(s);continue}if(s=this.tokenizer.code(e)){e=e.substring(s.raw.length);let a=t.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=`
`+s.raw,a.text+=`
`+s.text,this.inlineQueue.at(-1).src=a.text):t.push(s);continue}if(s=this.tokenizer.fences(e)){e=e.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.heading(e)){e=e.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.hr(e)){e=e.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.blockquote(e)){e=e.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.list(e)){e=e.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.html(e)){e=e.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.def(e)){e=e.substring(s.raw.length);let a=t.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=`
`+s.raw,a.text+=`
`+s.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[s.tag]||(this.tokens.links[s.tag]={href:s.href,title:s.title});continue}if(s=this.tokenizer.table(e)){e=e.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.lheading(e)){e=e.substring(s.raw.length),t.push(s);continue}let o=e;if(this.options.extensions?.startBlock){let a=1/0,l=e.slice(1),u;this.options.extensions.startBlock.forEach(p=>{u=p.call({lexer:this},l),typeof u=="number"&&u>=0&&(a=Math.min(a,u))}),a<1/0&&a>=0&&(o=e.substring(0,a+1))}if(this.state.top&&(s=this.tokenizer.paragraph(o))){let a=t.at(-1);i&&a?.type==="paragraph"?(a.raw+=`
`+s.raw,a.text+=`
`+s.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):t.push(s),i=o.length!==e.length,e=e.substring(s.raw.length);continue}if(s=this.tokenizer.text(e)){e=e.substring(s.raw.length);let a=t.at(-1);a?.type==="text"?(a.raw+=`
`+s.raw,a.text+=`
`+s.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):t.push(s);continue}if(e){let a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let i=e,s=null;if(this.tokens.links){let l=Object.keys(this.tokens.links);if(l.length>0)for(;(s=this.tokenizer.rules.inline.reflinkSearch.exec(i))!=null;)l.includes(s[0].slice(s[0].lastIndexOf("[")+1,-1))&&(i=i.slice(0,s.index)+"["+"a".repeat(s[0].length-2)+"]"+i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(s=this.tokenizer.rules.inline.anyPunctuation.exec(i))!=null;)i=i.slice(0,s.index)+"++"+i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;(s=this.tokenizer.rules.inline.blockSkip.exec(i))!=null;)i=i.slice(0,s.index)+"["+"a".repeat(s[0].length-2)+"]"+i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);let o=!1,a="";for(;e;){o||(a=""),o=!1;let l;if(this.options.extensions?.inline?.some(p=>(l=p.call({lexer:this},e,t))?(e=e.substring(l.raw.length),t.push(l),!0):!1))continue;if(l=this.tokenizer.escape(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.tag(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.link(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(l.raw.length);let p=t.at(-1);l.type==="text"&&p?.type==="text"?(p.raw+=l.raw,p.text+=l.text):t.push(l);continue}if(l=this.tokenizer.emStrong(e,i,a)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.codespan(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.br(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.del(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.autolink(e)){e=e.substring(l.raw.length),t.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(e))){e=e.substring(l.raw.length),t.push(l);continue}let u=e;if(this.options.extensions?.startInline){let p=1/0,f=e.slice(1),w;this.options.extensions.startInline.forEach(m=>{w=m.call({lexer:this},f),typeof w=="number"&&w>=0&&(p=Math.min(p,w))}),p<1/0&&p>=0&&(u=e.substring(0,p+1))}if(l=this.tokenizer.inlineText(u)){e=e.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(a=l.raw.slice(-1)),o=!0;let p=t.at(-1);p?.type==="text"?(p.raw+=l.raw,p.text+=l.text):t.push(l);continue}if(e){let p="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(p);break}else throw new Error(p)}}return t}},ze=class{options;parser;constructor(n){this.options=n||ne}space(n){return""}code({text:n,lang:e,escaped:t}){let i=(e||"").match(O.notSpaceStart)?.[0],s=n.replace(O.endingNewline,"")+`
`;return i?'<pre><code class="language-'+H(i)+'">'+(t?s:H(s,!0))+`</code></pre>
`:"<pre><code>"+(t?s:H(s,!0))+`</code></pre>
`}blockquote({tokens:n}){return`<blockquote>
${this.parser.parse(n)}</blockquote>
`}html({text:n}){return n}heading({tokens:n,depth:e}){return`<h${e}>${this.parser.parseInline(n)}</h${e}>
`}hr(n){return`<hr>
`}list(n){let e=n.ordered,t=n.start,i="";for(let a=0;a<n.items.length;a++){let l=n.items[a];i+=this.listitem(l)}let s=e?"ol":"ul",o=e&&t!==1?' start="'+t+'"':"";return"<"+s+o+`>
`+i+"</"+s+`>
`}listitem(n){let e="";if(n.task){let t=this.checkbox({checked:!!n.checked});n.loose?n.tokens[0]?.type==="paragraph"?(n.tokens[0].text=t+" "+n.tokens[0].text,n.tokens[0].tokens&&n.tokens[0].tokens.length>0&&n.tokens[0].tokens[0].type==="text"&&(n.tokens[0].tokens[0].text=t+" "+H(n.tokens[0].tokens[0].text),n.tokens[0].tokens[0].escaped=!0)):n.tokens.unshift({type:"text",raw:t+" ",text:t+" ",escaped:!0}):e+=t+" "}return e+=this.parser.parse(n.tokens,!!n.loose),`<li>${e}</li>
`}checkbox({checked:n}){return"<input "+(n?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:n}){return`<p>${this.parser.parseInline(n)}</p>
`}table(n){let e="",t="";for(let s=0;s<n.header.length;s++)t+=this.tablecell(n.header[s]);e+=this.tablerow({text:t});let i="";for(let s=0;s<n.rows.length;s++){let o=n.rows[s];t="";for(let a=0;a<o.length;a++)t+=this.tablecell(o[a]);i+=this.tablerow({text:t})}return i&&(i=`<tbody>${i}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+i+`</table>
`}tablerow({text:n}){return`<tr>
${n}</tr>
`}tablecell(n){let e=this.parser.parseInline(n.tokens),t=n.header?"th":"td";return(n.align?`<${t} align="${n.align}">`:`<${t}>`)+e+`</${t}>
`}strong({tokens:n}){return`<strong>${this.parser.parseInline(n)}</strong>`}em({tokens:n}){return`<em>${this.parser.parseInline(n)}</em>`}codespan({text:n}){return`<code>${H(n,!0)}</code>`}br(n){return"<br>"}del({tokens:n}){return`<del>${this.parser.parseInline(n)}</del>`}link({href:n,title:e,tokens:t}){let i=this.parser.parseInline(t),s=tn(n);if(s===null)return i;n=s;let o='<a href="'+n+'"';return e&&(o+=' title="'+H(e)+'"'),o+=">"+i+"</a>",o}image({href:n,title:e,text:t,tokens:i}){i&&(t=this.parser.parseInline(i,this.parser.textRenderer));let s=tn(n);if(s===null)return H(t);n=s;let o=`<img src="${n}" alt="${t}"`;return e&&(o+=` title="${H(e)}"`),o+=">",o}text(n){return"tokens"in n&&n.tokens?this.parser.parseInline(n.tokens):"escaped"in n&&n.escaped?n.text:H(n.text)}},bt=class{strong({text:n}){return n}em({text:n}){return n}codespan({text:n}){return n}del({text:n}){return n}html({text:n}){return n}text({text:n}){return n}link({text:n}){return""+n}image({text:n}){return""+n}br(){return""}},Y=class lt{options;renderer;textRenderer;constructor(e){this.options=e||ne,this.options.renderer=this.options.renderer||new ze,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new bt}static parse(e,t){return new lt(t).parse(e)}static parseInline(e,t){return new lt(t).parseInline(e)}parse(e,t=!0){let i="";for(let s=0;s<e.length;s++){let o=e[s];if(this.options.extensions?.renderers?.[o.type]){let l=o,u=this.options.extensions.renderers[l.type].call({parser:this},l);if(u!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(l.type)){i+=u||"";continue}}let a=o;switch(a.type){case"space":{i+=this.renderer.space(a);continue}case"hr":{i+=this.renderer.hr(a);continue}case"heading":{i+=this.renderer.heading(a);continue}case"code":{i+=this.renderer.code(a);continue}case"table":{i+=this.renderer.table(a);continue}case"blockquote":{i+=this.renderer.blockquote(a);continue}case"list":{i+=this.renderer.list(a);continue}case"html":{i+=this.renderer.html(a);continue}case"paragraph":{i+=this.renderer.paragraph(a);continue}case"text":{let l=a,u=this.renderer.text(l);for(;s+1<e.length&&e[s+1].type==="text";)l=e[++s],u+=`
`+this.renderer.text(l);t?i+=this.renderer.paragraph({type:"paragraph",raw:u,text:u,tokens:[{type:"text",raw:u,text:u,escaped:!0}]}):i+=u;continue}default:{let l='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return i}parseInline(e,t=this.renderer){let i="";for(let s=0;s<e.length;s++){let o=e[s];if(this.options.extensions?.renderers?.[o.type]){let l=this.options.extensions.renderers[o.type].call({parser:this},o);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(o.type)){i+=l||"";continue}}let a=o;switch(a.type){case"escape":{i+=t.text(a);break}case"html":{i+=t.html(a);break}case"link":{i+=t.link(a);break}case"image":{i+=t.image(a);break}case"strong":{i+=t.strong(a);break}case"em":{i+=t.em(a);break}case"codespan":{i+=t.codespan(a);break}case"br":{i+=t.br(a);break}case"del":{i+=t.del(a);break}case"text":{i+=t.text(a);break}default:{let l='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return i}},Me=class{options;block;constructor(n){this.options=n||ne}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(n){return n}postprocess(n){return n}processAllTokens(n){return n}provideLexer(){return this.block?Z.lex:Z.lexInline}provideParser(){return this.block?Y.parse:Y.parseInline}},Cs=class{defaults=ct();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Y;Renderer=ze;TextRenderer=bt;Lexer=Z;Tokenizer=Pe;Hooks=Me;constructor(...n){this.use(...n)}walkTokens(n,e){let t=[];for(let i of n)switch(t=t.concat(e.call(this,i)),i.type){case"table":{let s=i;for(let o of s.header)t=t.concat(this.walkTokens(o.tokens,e));for(let o of s.rows)for(let a of o)t=t.concat(this.walkTokens(a.tokens,e));break}case"list":{let s=i;t=t.concat(this.walkTokens(s.items,e));break}default:{let s=i;this.defaults.extensions?.childTokens?.[s.type]?this.defaults.extensions.childTokens[s.type].forEach(o=>{let a=s[o].flat(1/0);t=t.concat(this.walkTokens(a,e))}):s.tokens&&(t=t.concat(this.walkTokens(s.tokens,e)))}}return t}use(...n){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return n.forEach(t=>{let i={...t};if(i.async=this.defaults.async||i.async||!1,t.extensions&&(t.extensions.forEach(s=>{if(!s.name)throw new Error("extension name required");if("renderer"in s){let o=e.renderers[s.name];o?e.renderers[s.name]=function(...a){let l=s.renderer.apply(this,a);return l===!1&&(l=o.apply(this,a)),l}:e.renderers[s.name]=s.renderer}if("tokenizer"in s){if(!s.level||s.level!=="block"&&s.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let o=e[s.level];o?o.unshift(s.tokenizer):e[s.level]=[s.tokenizer],s.start&&(s.level==="block"?e.startBlock?e.startBlock.push(s.start):e.startBlock=[s.start]:s.level==="inline"&&(e.startInline?e.startInline.push(s.start):e.startInline=[s.start]))}"childTokens"in s&&s.childTokens&&(e.childTokens[s.name]=s.childTokens)}),i.extensions=e),t.renderer){let s=this.defaults.renderer||new ze(this.defaults);for(let o in t.renderer){if(!(o in s))throw new Error(`renderer '${o}' does not exist`);if(["options","parser"].includes(o))continue;let a=o,l=t.renderer[a],u=s[a];s[a]=(...p)=>{let f=l.apply(s,p);return f===!1&&(f=u.apply(s,p)),f||""}}i.renderer=s}if(t.tokenizer){let s=this.defaults.tokenizer||new Pe(this.defaults);for(let o in t.tokenizer){if(!(o in s))throw new Error(`tokenizer '${o}' does not exist`);if(["options","rules","lexer"].includes(o))continue;let a=o,l=t.tokenizer[a],u=s[a];s[a]=(...p)=>{let f=l.apply(s,p);return f===!1&&(f=u.apply(s,p)),f}}i.tokenizer=s}if(t.hooks){let s=this.defaults.hooks||new Me;for(let o in t.hooks){if(!(o in s))throw new Error(`hook '${o}' does not exist`);if(["options","block"].includes(o))continue;let a=o,l=t.hooks[a],u=s[a];Me.passThroughHooks.has(o)?s[a]=p=>{if(this.defaults.async)return Promise.resolve(l.call(s,p)).then(w=>u.call(s,w));let f=l.call(s,p);return u.call(s,f)}:s[a]=(...p)=>{let f=l.apply(s,p);return f===!1&&(f=u.apply(s,p)),f}}i.hooks=s}if(t.walkTokens){let s=this.defaults.walkTokens,o=t.walkTokens;i.walkTokens=function(a){let l=[];return l.push(o.call(this,a)),s&&(l=l.concat(s.call(this,a))),l}}this.defaults={...this.defaults,...i}}),this}setOptions(n){return this.defaults={...this.defaults,...n},this}lexer(n,e){return Z.lex(n,e??this.defaults)}parser(n,e){return Y.parse(n,e??this.defaults)}parseMarkdown(n){return(t,i)=>{let s={...i},o={...this.defaults,...s},a=this.onError(!!o.silent,!!o.async);if(this.defaults.async===!0&&s.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));o.hooks&&(o.hooks.options=o,o.hooks.block=n);let l=o.hooks?o.hooks.provideLexer():n?Z.lex:Z.lexInline,u=o.hooks?o.hooks.provideParser():n?Y.parse:Y.parseInline;if(o.async)return Promise.resolve(o.hooks?o.hooks.preprocess(t):t).then(p=>l(p,o)).then(p=>o.hooks?o.hooks.processAllTokens(p):p).then(p=>o.walkTokens?Promise.all(this.walkTokens(p,o.walkTokens)).then(()=>p):p).then(p=>u(p,o)).then(p=>o.hooks?o.hooks.postprocess(p):p).catch(a);try{o.hooks&&(t=o.hooks.preprocess(t));let p=l(t,o);o.hooks&&(p=o.hooks.processAllTokens(p)),o.walkTokens&&this.walkTokens(p,o.walkTokens);let f=u(p,o);return o.hooks&&(f=o.hooks.postprocess(f)),f}catch(p){return a(p)}}}onError(n,e){return t=>{if(t.message+=`
Please report this to https://github.com/markedjs/marked.`,n){let i="<p>An error occurred:</p><pre>"+H(t.message+"",!0)+"</pre>";return e?Promise.resolve(i):i}if(e)return Promise.reject(t);throw t}}},te=new Cs;function b(n,e){return te.parse(n,e)}b.options=b.setOptions=function(n){return te.setOptions(n),b.defaults=te.defaults,rn(b.defaults),b};b.getDefaults=ct;b.defaults=ne;b.use=function(...n){return te.use(...n),b.defaults=te.defaults,rn(b.defaults),b};b.walkTokens=function(n,e){return te.walkTokens(n,e)};b.parseInline=te.parseInline;b.Parser=Y;b.parser=Y.parse;b.Renderer=ze;b.TextRenderer=bt;b.Lexer=Z;b.lexer=Z.lex;b.Tokenizer=Pe;b.Hooks=Me;b.parse=b;var ni=b.options,si=b.setOptions,ii=b.use,ri=b.walkTokens,oi=b.parseInline;var ai=Y.parse,li=Z.lex;var{entries:yn,setPrototypeOf:mn,isFrozen:Ls,getPrototypeOf:vs,getOwnPropertyDescriptor:Is}=Object,{freeze:M,seal:$,create:yt}=Object,{apply:St,construct:At}=typeof Reflect<"u"&&Reflect;M||(M=function(e){return e});$||($=function(e){return e});St||(St=function(e,t){for(var i=arguments.length,s=new Array(i>2?i-2:0),o=2;o<i;o++)s[o-2]=arguments[o];return e.apply(t,s)});At||(At=function(e){for(var t=arguments.length,i=new Array(t>1?t-1:0),s=1;s<t;s++)i[s-1]=arguments[s];return new e(...i)});var Ue=N(Array.prototype.forEach),Os=N(Array.prototype.lastIndexOf),bn=N(Array.prototype.pop),ke=N(Array.prototype.push),Ds=N(Array.prototype.splice),He=N(String.prototype.toLowerCase),kt=N(String.prototype.toString),xt=N(String.prototype.match),xe=N(String.prototype.replace),Ms=N(String.prototype.indexOf),Ns=N(String.prototype.trim),B=N(Object.prototype.hasOwnProperty),D=N(RegExp.prototype.test),we=Ps(TypeError);function N(n){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var t=arguments.length,i=new Array(t>1?t-1:0),s=1;s<t;s++)i[s-1]=arguments[s];return St(n,e,i)}}function Ps(n){return function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];return At(n,t)}}function g(n,e){let t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:He;mn&&mn(n,null);let i=e.length;for(;i--;){let s=e[i];if(typeof s=="string"){let o=t(s);o!==s&&(Ls(e)||(e[i]=o),s=o)}n[s]=!0}return n}function zs(n){for(let e=0;e<n.length;e++)B(n,e)||(n[e]=null);return n}function G(n){let e=yt(null);for(let[t,i]of yn(n))B(n,t)&&(Array.isArray(i)?e[t]=zs(i):i&&typeof i=="object"&&i.constructor===Object?e[t]=G(i):e[t]=i);return e}function Te(n,e){for(;n!==null;){let i=Is(n,e);if(i){if(i.get)return N(i.get);if(typeof i.value=="function")return N(i.value)}n=vs(n)}function t(){return null}return t}var kn=M(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),wt=M(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Tt=M(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),$s=M(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),_t=M(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Bs=M(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),xn=M(["#text"]),wn=M(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Et=M(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Tn=M(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Fe=M(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Us=$(/\{\{[\w\W]*|[\w\W]*\}\}/gm),Fs=$(/<%[\w\W]*|[\w\W]*%>/gm),Hs=$(/\$\{[\w\W]*/gm),Gs=$(/^data-[\-\w.\u00B7-\uFFFF]+$/),Ws=$(/^aria-[\-\w]+$/),Sn=$(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),qs=$(/^(?:\w+script|data):/i),js=$(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),An=$(/^html$/i),Zs=$(/^[a-z][.\w]*(-[.\w]+)+$/i),_n=Object.freeze({__proto__:null,ARIA_ATTR:Ws,ATTR_WHITESPACE:js,CUSTOM_ELEMENT:Zs,DATA_ATTR:Gs,DOCTYPE_NAME:An,ERB_EXPR:Fs,IS_ALLOWED_URI:Sn,IS_SCRIPT_OR_DATA:qs,MUSTACHE_EXPR:Us,TMPLIT_EXPR:Hs}),_e={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,progressingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},Ys=function(){return typeof window>"u"?null:window},Xs=function(e,t){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let i=null,s="data-tt-policy-suffix";t&&t.hasAttribute(s)&&(i=t.getAttribute(s));let o="dompurify"+(i?"#"+i:"");try{return e.createPolicy(o,{createHTML(a){return a},createScriptURL(a){return a}})}catch{return console.warn("TrustedTypes policy "+o+" could not be created."),null}},En=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function Rn(){let n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Ys(),e=d=>Rn(d);if(e.version="3.3.1",e.removed=[],!n||!n.document||n.document.nodeType!==_e.document||!n.Element)return e.isSupported=!1,e;let{document:t}=n,i=t,s=i.currentScript,{DocumentFragment:o,HTMLTemplateElement:a,Node:l,Element:u,NodeFilter:p,NamedNodeMap:f=n.NamedNodeMap||n.MozNamedAttrMap,HTMLFormElement:w,DOMParser:m,trustedTypes:E}=n,k=u.prototype,P=Te(k,"cloneNode"),Ee=Te(k,"remove"),pe=Te(k,"nextSibling"),ye=Te(k,"childNodes"),X=Te(k,"parentNode");if(typeof a=="function"){let d=t.createElement("template");d.content&&d.content.ownerDocument&&(t=d.content.ownerDocument)}let A,V="",{implementation:Q,createNodeIterator:K,createDocumentFragment:On,getElementsByTagName:Dn}=t,{importNode:Mn}=i,I=En();e.isSupported=typeof yn=="function"&&typeof X=="function"&&Q&&Q.createHTMLDocument!==void 0;let{MUSTACHE_EXPR:qe,ERB_EXPR:je,TMPLIT_EXPR:Ze,DATA_ATTR:Nn,ARIA_ATTR:Pn,IS_SCRIPT_OR_DATA:zn,ATTR_WHITESPACE:Lt,CUSTOM_ELEMENT:$n}=_n,{IS_ALLOWED_URI:vt}=_n,R=null,It=g({},[...kn,...wt,...Tt,..._t,...xn]),C=null,Ot=g({},[...wn,...Et,...Tn,...Fe]),_=Object.seal(yt(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),ue=null,Ye=null,se=Object.seal(yt(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),Dt=!0,Xe=!0,Mt=!1,Nt=!0,ie=!1,Se=!0,J=!1,Ve=!1,Qe=!1,re=!1,Ae=!1,Re=!1,Pt=!0,zt=!1,Bn="user-content-",Ke=!0,he=!1,oe={},U=null,Je=g({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),$t=null,Bt=g({},["audio","video","img","source","image","track"]),et=null,Ut=g({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Ce="http://www.w3.org/1998/Math/MathML",Le="http://www.w3.org/2000/svg",W="http://www.w3.org/1999/xhtml",ae=W,tt=!1,nt=null,Un=g({},[Ce,Le,W],kt),ve=g({},["mi","mo","mn","ms","mtext"]),Ie=g({},["annotation-xml"]),Fn=g({},["title","style","font","a","script"]),de=null,Hn=["application/xhtml+xml","text/html"],Gn="text/html",S=null,le=null,Wn=t.createElement("form"),Ft=function(r){return r instanceof RegExp||r instanceof Function},st=function(){let r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(le&&le===r)){if((!r||typeof r!="object")&&(r={}),r=G(r),de=Hn.indexOf(r.PARSER_MEDIA_TYPE)===-1?Gn:r.PARSER_MEDIA_TYPE,S=de==="application/xhtml+xml"?kt:He,R=B(r,"ALLOWED_TAGS")?g({},r.ALLOWED_TAGS,S):It,C=B(r,"ALLOWED_ATTR")?g({},r.ALLOWED_ATTR,S):Ot,nt=B(r,"ALLOWED_NAMESPACES")?g({},r.ALLOWED_NAMESPACES,kt):Un,et=B(r,"ADD_URI_SAFE_ATTR")?g(G(Ut),r.ADD_URI_SAFE_ATTR,S):Ut,$t=B(r,"ADD_DATA_URI_TAGS")?g(G(Bt),r.ADD_DATA_URI_TAGS,S):Bt,U=B(r,"FORBID_CONTENTS")?g({},r.FORBID_CONTENTS,S):Je,ue=B(r,"FORBID_TAGS")?g({},r.FORBID_TAGS,S):G({}),Ye=B(r,"FORBID_ATTR")?g({},r.FORBID_ATTR,S):G({}),oe=B(r,"USE_PROFILES")?r.USE_PROFILES:!1,Dt=r.ALLOW_ARIA_ATTR!==!1,Xe=r.ALLOW_DATA_ATTR!==!1,Mt=r.ALLOW_UNKNOWN_PROTOCOLS||!1,Nt=r.ALLOW_SELF_CLOSE_IN_ATTR!==!1,ie=r.SAFE_FOR_TEMPLATES||!1,Se=r.SAFE_FOR_XML!==!1,J=r.WHOLE_DOCUMENT||!1,re=r.RETURN_DOM||!1,Ae=r.RETURN_DOM_FRAGMENT||!1,Re=r.RETURN_TRUSTED_TYPE||!1,Qe=r.FORCE_BODY||!1,Pt=r.SANITIZE_DOM!==!1,zt=r.SANITIZE_NAMED_PROPS||!1,Ke=r.KEEP_CONTENT!==!1,he=r.IN_PLACE||!1,vt=r.ALLOWED_URI_REGEXP||Sn,ae=r.NAMESPACE||W,ve=r.MATHML_TEXT_INTEGRATION_POINTS||ve,Ie=r.HTML_INTEGRATION_POINTS||Ie,_=r.CUSTOM_ELEMENT_HANDLING||{},r.CUSTOM_ELEMENT_HANDLING&&Ft(r.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(_.tagNameCheck=r.CUSTOM_ELEMENT_HANDLING.tagNameCheck),r.CUSTOM_ELEMENT_HANDLING&&Ft(r.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(_.attributeNameCheck=r.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),r.CUSTOM_ELEMENT_HANDLING&&typeof r.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(_.allowCustomizedBuiltInElements=r.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),ie&&(Xe=!1),Ae&&(re=!0),oe&&(R=g({},xn),C=[],oe.html===!0&&(g(R,kn),g(C,wn)),oe.svg===!0&&(g(R,wt),g(C,Et),g(C,Fe)),oe.svgFilters===!0&&(g(R,Tt),g(C,Et),g(C,Fe)),oe.mathMl===!0&&(g(R,_t),g(C,Tn),g(C,Fe))),r.ADD_TAGS&&(typeof r.ADD_TAGS=="function"?se.tagCheck=r.ADD_TAGS:(R===It&&(R=G(R)),g(R,r.ADD_TAGS,S))),r.ADD_ATTR&&(typeof r.ADD_ATTR=="function"?se.attributeCheck=r.ADD_ATTR:(C===Ot&&(C=G(C)),g(C,r.ADD_ATTR,S))),r.ADD_URI_SAFE_ATTR&&g(et,r.ADD_URI_SAFE_ATTR,S),r.FORBID_CONTENTS&&(U===Je&&(U=G(U)),g(U,r.FORBID_CONTENTS,S)),r.ADD_FORBID_CONTENTS&&(U===Je&&(U=G(U)),g(U,r.ADD_FORBID_CONTENTS,S)),Ke&&(R["#text"]=!0),J&&g(R,["html","head","body"]),R.table&&(g(R,["tbody"]),delete ue.tbody),r.TRUSTED_TYPES_POLICY){if(typeof r.TRUSTED_TYPES_POLICY.createHTML!="function")throw we('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof r.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw we('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');A=r.TRUSTED_TYPES_POLICY,V=A.createHTML("")}else A===void 0&&(A=Xs(E,s)),A!==null&&typeof V=="string"&&(V=A.createHTML(""));M&&M(r),le=r}},Ht=g({},[...wt,...Tt,...$s]),Gt=g({},[..._t,...Bs]),qn=function(r){let c=X(r);(!c||!c.tagName)&&(c={namespaceURI:ae,tagName:"template"});let h=He(r.tagName),T=He(c.tagName);return nt[r.namespaceURI]?r.namespaceURI===Le?c.namespaceURI===W?h==="svg":c.namespaceURI===Ce?h==="svg"&&(T==="annotation-xml"||ve[T]):!!Ht[h]:r.namespaceURI===Ce?c.namespaceURI===W?h==="math":c.namespaceURI===Le?h==="math"&&Ie[T]:!!Gt[h]:r.namespaceURI===W?c.namespaceURI===Le&&!Ie[T]||c.namespaceURI===Ce&&!ve[T]?!1:!Gt[h]&&(Fn[h]||!Ht[h]):!!(de==="application/xhtml+xml"&&nt[r.namespaceURI]):!1},F=function(r){ke(e.removed,{element:r});try{X(r).removeChild(r)}catch{Ee(r)}},ee=function(r,c){try{ke(e.removed,{attribute:c.getAttributeNode(r),from:c})}catch{ke(e.removed,{attribute:null,from:c})}if(c.removeAttribute(r),r==="is")if(re||Ae)try{F(c)}catch{}else try{c.setAttribute(r,"")}catch{}},Wt=function(r){let c=null,h=null;if(Qe)r="<remove></remove>"+r;else{let y=xt(r,/^[\r\n\t ]+/);h=y&&y[0]}de==="application/xhtml+xml"&&ae===W&&(r='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+r+"</body></html>");let T=A?A.createHTML(r):r;if(ae===W)try{c=new m().parseFromString(T,de)}catch{}if(!c||!c.documentElement){c=Q.createDocument(ae,"template",null);try{c.documentElement.innerHTML=tt?V:T}catch{}}let v=c.body||c.documentElement;return r&&h&&v.insertBefore(t.createTextNode(h),v.childNodes[0]||null),ae===W?Dn.call(c,J?"html":"body")[0]:J?c.documentElement:v},qt=function(r){return K.call(r.ownerDocument||r,r,p.SHOW_ELEMENT|p.SHOW_COMMENT|p.SHOW_TEXT|p.SHOW_PROCESSING_INSTRUCTION|p.SHOW_CDATA_SECTION,null)},it=function(r){return r instanceof w&&(typeof r.nodeName!="string"||typeof r.textContent!="string"||typeof r.removeChild!="function"||!(r.attributes instanceof f)||typeof r.removeAttribute!="function"||typeof r.setAttribute!="function"||typeof r.namespaceURI!="string"||typeof r.insertBefore!="function"||typeof r.hasChildNodes!="function")},jt=function(r){return typeof l=="function"&&r instanceof l};function q(d,r,c){Ue(d,h=>{h.call(e,r,c,le)})}let Zt=function(r){let c=null;if(q(I.beforeSanitizeElements,r,null),it(r))return F(r),!0;let h=S(r.nodeName);if(q(I.uponSanitizeElement,r,{tagName:h,allowedTags:R}),Se&&r.hasChildNodes()&&!jt(r.firstElementChild)&&D(/<[/\w!]/g,r.innerHTML)&&D(/<[/\w!]/g,r.textContent)||r.nodeType===_e.progressingInstruction||Se&&r.nodeType===_e.comment&&D(/<[/\w]/g,r.data))return F(r),!0;if(!(se.tagCheck instanceof Function&&se.tagCheck(h))&&(!R[h]||ue[h])){if(!ue[h]&&Xt(h)&&(_.tagNameCheck instanceof RegExp&&D(_.tagNameCheck,h)||_.tagNameCheck instanceof Function&&_.tagNameCheck(h)))return!1;if(Ke&&!U[h]){let T=X(r)||r.parentNode,v=ye(r)||r.childNodes;if(v&&T){let y=v.length;for(let z=y-1;z>=0;--z){let j=P(v[z],!0);j.__removalCount=(r.__removalCount||0)+1,T.insertBefore(j,pe(r))}}}return F(r),!0}return r instanceof u&&!qn(r)||(h==="noscript"||h==="noembed"||h==="noframes")&&D(/<\/no(script|embed|frames)/i,r.innerHTML)?(F(r),!0):(ie&&r.nodeType===_e.text&&(c=r.textContent,Ue([qe,je,Ze],T=>{c=xe(c,T," ")}),r.textContent!==c&&(ke(e.removed,{element:r.cloneNode()}),r.textContent=c)),q(I.afterSanitizeElements,r,null),!1)},Yt=function(r,c,h){if(Pt&&(c==="id"||c==="name")&&(h in t||h in Wn))return!1;if(!(Xe&&!Ye[c]&&D(Nn,c))){if(!(Dt&&D(Pn,c))){if(!(se.attributeCheck instanceof Function&&se.attributeCheck(c,r))){if(!C[c]||Ye[c]){if(!(Xt(r)&&(_.tagNameCheck instanceof RegExp&&D(_.tagNameCheck,r)||_.tagNameCheck instanceof Function&&_.tagNameCheck(r))&&(_.attributeNameCheck instanceof RegExp&&D(_.attributeNameCheck,c)||_.attributeNameCheck instanceof Function&&_.attributeNameCheck(c,r))||c==="is"&&_.allowCustomizedBuiltInElements&&(_.tagNameCheck instanceof RegExp&&D(_.tagNameCheck,h)||_.tagNameCheck instanceof Function&&_.tagNameCheck(h))))return!1}else if(!et[c]){if(!D(vt,xe(h,Lt,""))){if(!((c==="src"||c==="xlink:href"||c==="href")&&r!=="script"&&Ms(h,"data:")===0&&$t[r])){if(!(Mt&&!D(zn,xe(h,Lt,"")))){if(h)return!1}}}}}}}return!0},Xt=function(r){return r!=="annotation-xml"&&xt(r,$n)},Vt=function(r){q(I.beforeSanitizeAttributes,r,null);let{attributes:c}=r;if(!c||it(r))return;let h={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:C,forceKeepAttr:void 0},T=c.length;for(;T--;){let v=c[T],{name:y,namespaceURI:z,value:j}=v,ce=S(y),rt=j,L=y==="value"?rt:Ns(rt);if(h.attrName=ce,h.attrValue=L,h.keepAttr=!0,h.forceKeepAttr=void 0,q(I.uponSanitizeAttribute,r,h),L=h.attrValue,zt&&(ce==="id"||ce==="name")&&(ee(y,r),L=Bn+L),Se&&D(/((--!?|])>)|<\/(style|title|textarea)/i,L)){ee(y,r);continue}if(ce==="attributename"&&xt(L,"href")){ee(y,r);continue}if(h.forceKeepAttr)continue;if(!h.keepAttr){ee(y,r);continue}if(!Nt&&D(/\/>/i,L)){ee(y,r);continue}ie&&Ue([qe,je,Ze],Kt=>{L=xe(L,Kt," ")});let Qt=S(r.nodeName);if(!Yt(Qt,ce,L)){ee(y,r);continue}if(A&&typeof E=="object"&&typeof E.getAttributeType=="function"&&!z)switch(E.getAttributeType(Qt,ce)){case"TrustedHTML":{L=A.createHTML(L);break}case"TrustedScriptURL":{L=A.createScriptURL(L);break}}if(L!==rt)try{z?r.setAttributeNS(z,y,L):r.setAttribute(y,L),it(r)?F(r):bn(e.removed)}catch{ee(y,r)}}q(I.afterSanitizeAttributes,r,null)},jn=function d(r){let c=null,h=qt(r);for(q(I.beforeSanitizeShadowDOM,r,null);c=h.nextNode();)q(I.uponSanitizeShadowNode,c,null),Zt(c),Vt(c),c.content instanceof o&&d(c.content);q(I.afterSanitizeShadowDOM,r,null)};return e.sanitize=function(d){let r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},c=null,h=null,T=null,v=null;if(tt=!d,tt&&(d="<!-->"),typeof d!="string"&&!jt(d))if(typeof d.toString=="function"){if(d=d.toString(),typeof d!="string")throw we("dirty is not a string, aborting")}else throw we("toString is not a function");if(!e.isSupported)return d;if(Ve||st(r),e.removed=[],typeof d=="string"&&(he=!1),he){if(d.nodeName){let j=S(d.nodeName);if(!R[j]||ue[j])throw we("root node is forbidden and cannot be sanitized in-place")}}else if(d instanceof l)c=Wt("<!---->"),h=c.ownerDocument.importNode(d,!0),h.nodeType===_e.element&&h.nodeName==="BODY"||h.nodeName==="HTML"?c=h:c.appendChild(h);else{if(!re&&!ie&&!J&&d.indexOf("<")===-1)return A&&Re?A.createHTML(d):d;if(c=Wt(d),!c)return re?null:Re?V:""}c&&Qe&&F(c.firstChild);let y=qt(he?d:c);for(;T=y.nextNode();)Zt(T),Vt(T),T.content instanceof o&&jn(T.content);if(he)return d;if(re){if(Ae)for(v=On.call(c.ownerDocument);c.firstChild;)v.appendChild(c.firstChild);else v=c;return(C.shadowroot||C.shadowrootmode)&&(v=Mn.call(i,v,!0)),v}let z=J?c.outerHTML:c.innerHTML;return J&&R["!doctype"]&&c.ownerDocument&&c.ownerDocument.doctype&&c.ownerDocument.doctype.name&&D(An,c.ownerDocument.doctype.name)&&(z="<!DOCTYPE "+c.ownerDocument.doctype.name+`>
`+z),ie&&Ue([qe,je,Ze],j=>{z=xe(z,j," ")}),A&&Re?A.createHTML(z):z},e.setConfig=function(){let d=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};st(d),Ve=!0},e.clearConfig=function(){le=null,Ve=!1},e.isValidAttribute=function(d,r,c){le||st({});let h=S(d),T=S(r);return Yt(h,T,c)},e.addHook=function(d,r){typeof r=="function"&&ke(I[d],r)},e.removeHook=function(d,r){if(r!==void 0){let c=Os(I[d],r);return c===-1?void 0:Ds(I[d],c,1)[0]}return bn(I[d])},e.removeHooks=function(d){I[d]=[]},e.removeAllHooks=function(){I=En()},e}var Cn=Rn();b.setOptions({gfm:!0,breaks:!0});var Vs=["p","br","strong","em","del","h1","h2","h3","h4","h5","h6","ul","ol","li","a","code","pre","blockquote","table","thead","tbody","tr","th","td","hr","img","span"],Qs=["href","target","rel","src","alt","title","class"];function Rt(n){if(!n)return"";let e=b.parse(n);return Cn.sanitize(e,{ALLOWED_TAGS:Vs,ALLOWED_ATTR:Qs})}var Ge=class{constructor({onSend:e,shadowRoot:t}){this.onSend=e,this.shadowRoot=t,this.container=null,this.editor=null,this.toolbar=null}build(){return this.container=document.createElement("div"),this.container.className="sc-editor-container",this.toolbar=document.createElement("div"),this.toolbar.className="sc-toolbar",this._buildToolbar(),this.container.appendChild(this.toolbar),this.editor=document.createElement("div"),this.editor.className="sc-editor",this.editor.contentEditable="true",this.editor.setAttribute("role","textbox"),this.editor.setAttribute("aria-multiline","true"),this.editor.dataset.placeholder="Type a message...",this.container.appendChild(this.editor),this.editor.addEventListener("keydown",e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),this.onSend())}),this.container}_buildToolbar(){[{cmd:"bold",icon:"B",title:"Bold (Ctrl+B)",style:"font-weight:bold"},{cmd:"italic",icon:"I",title:"Italic (Ctrl+I)",style:"font-style:italic"},{cmd:"underline",icon:"U",title:"Underline (Ctrl+U)",style:"text-decoration:underline"},{cmd:"insertOrderedList",icon:"OL",title:"Ordered list"},{cmd:"insertUnorderedList",icon:"UL",title:"Unordered list"},{cmd:"code",icon:"</>",title:"Inline code",custom:!0},{cmd:"heading",icon:"H",title:"Heading",custom:!0},{cmd:"createLink",icon:"\u{1F517}",title:"Insert link",custom:!0}].forEach(({cmd:t,icon:i,title:s,style:o,custom:a})=>{let l=document.createElement("button");l.type="button",l.className="sc-toolbar-btn",l.innerHTML=i,l.title=s,o&&(l.style.cssText=o),l.addEventListener("mousedown",u=>{u.preventDefault(),a?this._handleCustomCommand(t):document.execCommand(t,!1,null)}),this.toolbar.appendChild(l)})}_handleCustomCommand(e){if(e==="code"){let t=this.shadowRoot.getSelection?this.shadowRoot.getSelection():document.getSelection();if(t&&t.rangeCount>0){let i=t.getRangeAt(0),s=document.createElement("code");try{i.surroundContents(s)}catch{s.textContent=t.toString(),i.deleteContents(),i.insertNode(s)}}}else if(e==="heading")document.execCommand("formatBlock",!1,"h3");else if(e==="createLink"){let t=prompt("Enter URL:");t&&document.execCommand("createLink",!1,t)}}getHTML(){return this.editor.innerHTML}isEmpty(){let e=this.editor.textContent.trim();return e===""||e===`
`}clear(){this.editor.innerHTML=""}focus(){this.editor.focus()}setEnabled(e){this.editor.contentEditable=e?"true":"false",this.container.classList.toggle("sc-editor-disabled",!e)}};function vn(n){let e=document.createElement("div");return e.innerHTML=n,Ct(e).trim()}function Ct(n){let e="";for(let t of n.childNodes)if(t.nodeType===Node.TEXT_NODE)e+=t.textContent;else if(t.nodeType===Node.ELEMENT_NODE){let i=t.tagName.toLowerCase(),s=Ct(t);switch(i){case"strong":case"b":e+=`**${s}**`;break;case"em":case"i":e+=`*${s}*`;break;case"u":e+=`__${s}__`;break;case"code":e+=`\`${s}\``;break;case"pre":e+=`
\`\`\`
${t.textContent}
\`\`\`
`;break;case"a":e+=`[${s}](${t.getAttribute("href")||""})`;break;case"h1":case"h2":case"h3":case"h4":case"h5":case"h6":{let o=parseInt(i[1]);e+=`
${"#".repeat(o)} ${s}
`;break}case"ul":e+=`
`+Ln(t,"ul")+`
`;break;case"ol":e+=`
`+Ln(t,"ol")+`
`;break;case"li":e+=s;break;case"br":e+=`
`;break;case"div":case"p":e+=`
${s}
`;break;default:e+=s}}return e}function Ln(n,e){let t="",i=1;for(let s of n.children)if(s.tagName.toLowerCase()==="li"){let o=e==="ol"?`${i++}. `:"- ";t+=o+Ct(s).trim()+`
`}return t}var In=`:host {
  all: initial;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #1f2937;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.sc-bubble {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--sc-primary, #4F46E5);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 999999;
}

.sc-bubble:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.sc-bubble svg {
  width: 24px;
  height: 24px;
  fill: white;
}

.sc-window {
  position: fixed;
  bottom: 88px;
  right: 20px;
  width: 380px;
  height: 520px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 999998;
  transition: opacity 0.2s, transform 0.2s;
}

.sc-window.sc-hidden {
  display: none;
}

.sc-header {
  background: var(--sc-primary, #4F46E5);
  color: white;
  padding: 16px;
  font-weight: 600;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sc-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  line-height: 1;
  opacity: 0.8;
}

.sc-close:hover {
  opacity: 1;
}

.sc-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sc-message {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 12px;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.5;
}

.sc-message-user {
  align-self: flex-end;
  background: var(--sc-primary, #4F46E5);
  color: white;
  border-bottom-right-radius: 4px;
  white-space: pre-wrap;
}

.sc-message-assistant {
  align-self: flex-start;
  background: #f3f4f6;
  color: #1f2937;
  border-bottom-left-radius: 4px;
}

.sc-message-greeting {
  align-self: flex-start;
  background: #f3f4f6;
  color: #1f2937;
  border-bottom-left-radius: 4px;
}

/* Markdown content in assistant messages */
.sc-message-assistant p {
  margin: 0 0 8px 0;
}
.sc-message-assistant p:last-child {
  margin-bottom: 0;
}

.sc-message-assistant h1,
.sc-message-assistant h2,
.sc-message-assistant h3,
.sc-message-assistant h4,
.sc-message-assistant h5,
.sc-message-assistant h6 {
  margin: 12px 0 6px 0;
  font-weight: 600;
  line-height: 1.3;
}
.sc-message-assistant h1 { font-size: 1.3em; }
.sc-message-assistant h2 { font-size: 1.2em; }
.sc-message-assistant h3 { font-size: 1.1em; }

.sc-message-assistant code {
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 0.9em;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
}

.sc-message-assistant pre {
  background: #1f2937;
  color: #e5e7eb;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 8px 0;
  font-size: 0.85em;
  line-height: 1.5;
}
.sc-message-assistant pre code {
  background: none;
  padding: 0;
  color: inherit;
}

.sc-message-assistant ul,
.sc-message-assistant ol {
  margin: 6px 0;
  padding-left: 20px;
}
.sc-message-assistant li {
  margin: 2px 0;
}

.sc-message-assistant a {
  color: var(--sc-primary, #4F46E5);
  text-decoration: underline;
}

.sc-message-assistant table {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
  font-size: 0.9em;
}
.sc-message-assistant th,
.sc-message-assistant td {
  border: 1px solid #d1d5db;
  padding: 6px 10px;
  text-align: left;
}
.sc-message-assistant th {
  background: #e5e7eb;
  font-weight: 600;
}

.sc-message-assistant blockquote {
  border-left: 3px solid #d1d5db;
  margin: 8px 0;
  padding: 4px 12px;
  color: #6b7280;
}

.sc-message-assistant hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 8px 0;
}

/* Typing indicator */
.sc-typing {
  align-self: flex-start;
  background: #f3f4f6;
  padding: 10px 14px;
  border-radius: 12px;
  border-bottom-left-radius: 4px;
  display: none;
}

.sc-typing.sc-active {
  display: block;
}

.sc-typing-dots {
  display: flex;
  gap: 4px;
}

.sc-typing-dots span {
  width: 6px;
  height: 6px;
  background: #9ca3af;
  border-radius: 50%;
  animation: sc-bounce 1.4s infinite ease-in-out;
}

.sc-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.sc-typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes sc-bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* Input area */
.sc-input-area {
  padding: 12px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

/* Rich text editor */
.sc-editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
}

.sc-editor-container:focus-within {
  border-color: var(--sc-primary, #4F46E5);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.sc-toolbar {
  display: flex;
  gap: 2px;
  padding: 4px 6px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
}

.sc-toolbar-btn {
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 2px 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  line-height: 1.4;
  min-width: 24px;
  text-align: center;
  font-family: inherit;
}

.sc-toolbar-btn:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.sc-editor {
  padding: 8px 12px;
  min-height: 36px;
  max-height: 120px;
  overflow-y: auto;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.5;
  outline: none;
}

.sc-editor:empty::before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
}

.sc-editor code {
  background: rgba(0, 0, 0, 0.06);
  padding: 1px 4px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.9em;
}

.sc-editor-disabled {
  opacity: 0.6;
  pointer-events: none;
}

.sc-send {
  background: var(--sc-primary, #4F46E5);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.2s;
  align-self: flex-end;
}

.sc-send:hover {
  opacity: 0.9;
}

.sc-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Mobile responsive */
@media (max-width: 480px) {
  .sc-window {
    width: 100%;
    height: 100%;
    bottom: 0;
    right: 0;
    border-radius: 0;
  }

  .sc-bubble {
    bottom: 16px;
    right: 16px;
  }
}
`;var Js='<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>',ei="\u2715",We=class{constructor(e,t,i){this.serverUrl=e,this.apiKey=t,this.config=i,this.isOpen=!1,this.isStreaming=!1,this.sessionId=this._getSessionId(),this.wsClient=null,this.host=null,this.shadow=null,this.richEditor=null}_getSessionId(){let e="smartchat_session_id",t=localStorage.getItem(e);return t||(t="sc_"+Math.random().toString(36).substring(2)+Date.now().toString(36),localStorage.setItem(e,t)),t}mount(){this.host=document.createElement("div"),this.host.id="smartchat-widget",this.shadow=this.host.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=In,this.shadow.appendChild(e),this.host.style.setProperty("--sc-primary",this.config.primary_color||"#4F46E5"),this._buildUI(),document.body.appendChild(this.host),this._connectWS()}_buildUI(){let e=document.createElement("button");e.className="sc-bubble",e.innerHTML=Js,e.addEventListener("click",()=>this._toggle()),this.shadow.appendChild(e),this.bubbleEl=e;let t=document.createElement("div");t.className="sc-window sc-hidden",t.innerHTML=`
      <div class="sc-header">
        <span>Chat</span>
        <button class="sc-close">${ei}</button>
      </div>
      <div class="sc-messages"></div>
    `;let i=document.createElement("div");i.className="sc-input-area",this.richEditor=new Ge({onSend:()=>this._sendMessage(),shadowRoot:this.shadow}),i.appendChild(this.richEditor.build()),this.sendBtn=document.createElement("button"),this.sendBtn.className="sc-send",this.sendBtn.textContent="Send",this.sendBtn.addEventListener("click",()=>this._sendMessage()),i.appendChild(this.sendBtn),t.appendChild(i),this.shadow.appendChild(t),this.windowEl=t,this.messagesEl=t.querySelector(".sc-messages"),t.querySelector(".sc-close").addEventListener("click",()=>this._toggle()),this.config.greeting&&this._addMessage("assistant",this.config.greeting)}_toggle(){this.isOpen=!this.isOpen,this.isOpen?(this.windowEl.classList.remove("sc-hidden"),this.richEditor.focus()):this.windowEl.classList.add("sc-hidden")}_addMessage(e,t){let i=document.createElement("div");return i.className=`sc-message sc-message-${e}`,e==="assistant"&&t?i.innerHTML=Rt(t):i.textContent=t,this.messagesEl.appendChild(i),this.messagesEl.scrollTop=this.messagesEl.scrollHeight,i}_appendToLastMessage(e){let t=this.messagesEl.querySelectorAll(".sc-message-assistant");if(t.length>0){let i=t[t.length-1];i._rawMarkdown||(i._rawMarkdown=""),i._rawMarkdown+=e,i._renderPending||(i._renderPending=!0,requestAnimationFrame(()=>{i.innerHTML=Rt(i._rawMarkdown),i._renderPending=!1,this.messagesEl.scrollTop=this.messagesEl.scrollHeight}))}}_sendMessage(){if(this.richEditor.isEmpty()||this.isStreaming)return;let e=this.richEditor.getHTML(),t=vn(e);if(!t.trim())return;this._addMessage("user",t),this.richEditor.clear(),this.isStreaming=!0,this.sendBtn.disabled=!0,this.richEditor.setEnabled(!1),this._addMessage("assistant",""),this.wsClient.send(t,this.apiKey)||(this._appendToLastMessage("Connection error. Please try again."),this.isStreaming=!1,this.sendBtn.disabled=!1,this.richEditor.setEnabled(!0))}_connectWS(){this.wsClient=new Oe(this.serverUrl,this.sessionId),this.wsClient.onChunk=e=>{this._appendToLastMessage(e)},this.wsClient.onDone=()=>{this.isStreaming=!1,this.sendBtn.disabled=!1,this.richEditor.setEnabled(!0)},this.wsClient.onError=e=>{this._appendToLastMessage(`
[Error: ${e}]`),this.isStreaming=!1,this.sendBtn.disabled=!1,this.richEditor.setEnabled(!0)},this.wsClient.connect()}};(function(){let n=document.currentScript;if(!n){console.error("SmartChat: Could not find script element");return}let e=n.getAttribute("data-api-key");if(!e){console.error("SmartChat: data-api-key attribute is required");return}let t=n.src,i=t.substring(0,t.lastIndexOf("/"));fetch(`${i}/api/widget/config/${e}`).then(s=>{if(!s.ok)throw new Error("Failed to load widget config");return s.json()}).then(s=>{new We(i,e,s).mount()}).catch(s=>{console.error("SmartChat: Failed to initialize",s)})})();})();
/*! Bundled license information:

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.3.1 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.1/LICENSE *)
*/

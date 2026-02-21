(()=>{var Oe=class{constructor(e,t){let i=e.startsWith("https")?"wss":"ws",n=e.replace(/^https?:\/\//,"");this.url=`${i}://${n}/api/chat/ws/chat/${t}`,this.ws=null,this.onChunk=null,this.onDone=null,this.onError=null,this.onOpen=null,this._reconnectTimer=null,this._intentionalClose=!1}connect(){this._intentionalClose=!1,this.ws=new WebSocket(this.url),this.ws.onopen=()=>{this.onOpen&&this.onOpen()},this.ws.onmessage=e=>{try{let t=JSON.parse(e.data);t.type==="chunk"&&this.onChunk?this.onChunk(t.content):t.type==="done"&&this.onDone?this.onDone():t.type==="error"&&this.onError&&this.onError(t.message)}catch(t){console.error("SmartChat: Failed to parse message",t)}},this.ws.onclose=()=>{this._intentionalClose||(this._reconnectTimer=setTimeout(()=>this.connect(),2e3))},this.ws.onerror=e=>{console.error("SmartChat: WebSocket error",e)}}send(e,t,i=null){if(this.ws&&this.ws.readyState===WebSocket.OPEN){let n={message:e,api_key:t};return i&&(n.user_token=i),this.ws.send(JSON.stringify(n)),!0}return!1}disconnect(){this._intentionalClose=!0,this._reconnectTimer&&clearTimeout(this._reconnectTimer),this.ws&&this.ws.close()}};function ct(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var ne=ct();function rn(s){ne=s}var me={exec:()=>null};function w(s,e=""){let t=typeof s=="string"?s:s.source,i={replace:(n,o)=>{let a=typeof o=="string"?o:o.source;return a=a.replace(O.caret,"$1"),t=t.replace(n,a),i},getRegex:()=>new RegExp(t,e)};return i}var O={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:s=>new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}#`),htmlBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}<(?:[a-z].*>|!--)`,"i")},Zn=/^(?:[ \t]*(?:\n|$))+/,Yn=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Xn=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,be=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Kn=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,ht=/(?:[*+-]|\d{1,9}[.)])/,on=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,an=w(on).replace(/bull/g,ht).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Vn=w(on).replace(/bull/g,ht).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),pt=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Qn=/^[^\n]+/,ut=/(?!\s*\])(?:\\.|[^\[\]\\])+/,Jn=w(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",ut).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),es=w(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,ht).getRegex(),$e="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",dt=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ts=w("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",dt).replace("tag",$e).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),ln=w(pt).replace("hr",be).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",$e).getRegex(),ns=w(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",ln).getRegex(),ft={blockquote:ns,code:Yn,def:Jn,fences:Xn,heading:Kn,hr:be,html:ts,lheading:an,list:es,newline:Zn,paragraph:ln,table:me,text:Qn},Jt=w("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",be).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",$e).getRegex(),ss={...ft,lheading:Vn,table:Jt,paragraph:w(pt).replace("hr",be).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Jt).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",$e).getRegex()},is={...ft,html:w(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",dt).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:me,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:w(pt).replace("hr",be).replace("heading",` *#{1,6} *[^
]`).replace("lheading",an).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},rs=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,os=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,cn=/^( {2,}|\\)\n(?!\s*$)/,as=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Fe=/[\p{P}\p{S}]/u,gt=/[\s\p{P}\p{S}]/u,hn=/[^\s\p{P}\p{S}]/u,ls=w(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,gt).getRegex(),pn=/(?!~)[\p{P}\p{S}]/u,cs=/(?!~)[\s\p{P}\p{S}]/u,hs=/(?:[^\s\p{P}\p{S}]|~)/u,ps=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,un=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,us=w(un,"u").replace(/punct/g,Fe).getRegex(),ds=w(un,"u").replace(/punct/g,pn).getRegex(),dn="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",fs=w(dn,"gu").replace(/notPunctSpace/g,hn).replace(/punctSpace/g,gt).replace(/punct/g,Fe).getRegex(),gs=w(dn,"gu").replace(/notPunctSpace/g,hs).replace(/punctSpace/g,cs).replace(/punct/g,pn).getRegex(),ms=w("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,hn).replace(/punctSpace/g,gt).replace(/punct/g,Fe).getRegex(),bs=w(/\\(punct)/,"gu").replace(/punct/g,Fe).getRegex(),xs=w(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),ks=w(dt).replace("(?:-->|$)","-->").getRegex(),ws=w("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",ks).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ne=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,Ts=w(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",Ne).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),fn=w(/^!?\[(label)\]\[(ref)\]/).replace("label",Ne).replace("ref",ut).getRegex(),gn=w(/^!?\[(ref)\](?:\[\])?/).replace("ref",ut).getRegex(),_s=w("reflink|nolink(?!\\()","g").replace("reflink",fn).replace("nolink",gn).getRegex(),mt={_backpedal:me,anyPunctuation:bs,autolink:xs,blockSkip:ps,br:cn,code:os,del:me,emStrongLDelim:us,emStrongRDelimAst:fs,emStrongRDelimUnd:ms,escape:rs,link:Ts,nolink:gn,punctuation:ls,reflink:fn,reflinkSearch:_s,tag:ws,text:as,url:me},ys={...mt,link:w(/^!?\[(label)\]\((.*?)\)/).replace("label",Ne).getRegex(),reflink:w(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ne).getRegex()},ot={...mt,emStrongRDelimAst:gs,emStrongLDelim:ds,url:w(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},Es={...ot,br:w(cn).replace("{2,}","*").getRegex(),text:w(ot.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Me={normal:ft,gfm:ss,pedantic:is},fe={normal:mt,gfm:ot,breaks:Es,pedantic:ys},Ss={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},en=s=>Ss[s];function H(s,e){if(e){if(O.escapeTest.test(s))return s.replace(O.escapeReplace,en)}else if(O.escapeTestNoEncode.test(s))return s.replace(O.escapeReplaceNoEncode,en);return s}function tn(s){try{s=encodeURI(s).replace(O.percentDecode,"%")}catch{return null}return s}function nn(s,e){let t=s.replace(O.findPipe,(o,a,l)=>{let p=!1,c=a;for(;--c>=0&&l[c]==="\\";)p=!p;return p?"|":" |"}),i=t.split(O.splitPipe),n=0;if(i[0].trim()||i.shift(),i.length>0&&!i.at(-1)?.trim()&&i.pop(),e)if(i.length>e)i.splice(e);else for(;i.length<e;)i.push("");for(;n<i.length;n++)i[n]=i[n].trim().replace(O.slashPipe,"|");return i}function ge(s,e,t){let i=s.length;if(i===0)return"";let n=0;for(;n<i;){let o=s.charAt(i-n-1);if(o===e&&!t)n++;else if(o!==e&&t)n++;else break}return s.slice(0,i-n)}function As(s,e){if(s.indexOf(e[1])===-1)return-1;let t=0;for(let i=0;i<s.length;i++)if(s[i]==="\\")i++;else if(s[i]===e[0])t++;else if(s[i]===e[1]&&(t--,t<0))return i;return t>0?-2:-1}function sn(s,e,t,i,n){let o=e.href,a=e.title||null,l=s[1].replace(n.other.outputLinkReplace,"$1");i.state.inLink=!0;let p={type:s[0].charAt(0)==="!"?"image":"link",raw:t,href:o,title:a,text:l,tokens:i.inlineTokens(l)};return i.state.inLink=!1,p}function Rs(s,e,t){let i=s.match(t.other.indentCodeCompensation);if(i===null)return e;let n=i[1];return e.split(`
`).map(o=>{let a=o.match(t.other.beginningSpace);if(a===null)return o;let[l]=a;return l.length>=n.length?o.slice(n.length):o}).join(`
`)}var Pe=class{options;rules;lexer;constructor(s){this.options=s||ne}space(s){let e=this.rules.block.newline.exec(s);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(s){let e=this.rules.block.code.exec(s);if(e){let t=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?t:ge(t,`
`)}}}fences(s){let e=this.rules.block.fences.exec(s);if(e){let t=e[0],i=Rs(t,e[3]||"",this.rules);return{type:"code",raw:t,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:i}}}heading(s){let e=this.rules.block.heading.exec(s);if(e){let t=e[2].trim();if(this.rules.other.endingHash.test(t)){let i=ge(t,"#");(this.options.pedantic||!i||this.rules.other.endingSpaceChar.test(i))&&(t=i.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:t,tokens:this.lexer.inline(t)}}}hr(s){let e=this.rules.block.hr.exec(s);if(e)return{type:"hr",raw:ge(e[0],`
`)}}blockquote(s){let e=this.rules.block.blockquote.exec(s);if(e){let t=ge(e[0],`
`).split(`
`),i="",n="",o=[];for(;t.length>0;){let a=!1,l=[],p;for(p=0;p<t.length;p++)if(this.rules.other.blockquoteStart.test(t[p]))l.push(t[p]),a=!0;else if(!a)l.push(t[p]);else break;t=t.slice(p);let c=l.join(`
`),f=c.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");i=i?`${i}
${c}`:c,n=n?`${n}
${f}`:f;let b=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(f,o,!0),this.lexer.state.top=b,t.length===0)break;let g=o.at(-1);if(g?.type==="code")break;if(g?.type==="blockquote"){let y=g,k=y.raw+`
`+t.join(`
`),P=this.blockquote(k);o[o.length-1]=P,i=i.substring(0,i.length-y.raw.length)+P.raw,n=n.substring(0,n.length-y.text.length)+P.text;break}else if(g?.type==="list"){let y=g,k=y.raw+`
`+t.join(`
`),P=this.list(k);o[o.length-1]=P,i=i.substring(0,i.length-g.raw.length)+P.raw,n=n.substring(0,n.length-y.raw.length)+P.raw,t=k.substring(o.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:i,tokens:o,text:n}}}list(s){let e=this.rules.block.list.exec(s);if(e){let t=e[1].trim(),i=t.length>1,n={type:"list",raw:"",ordered:i,start:i?+t.slice(0,-1):"",loose:!1,items:[]};t=i?`\\d{1,9}\\${t.slice(-1)}`:`\\${t}`,this.options.pedantic&&(t=i?t:"[*+-]");let o=this.rules.other.listItemRegex(t),a=!1;for(;s;){let p=!1,c="",f="";if(!(e=o.exec(s))||this.rules.block.hr.test(s))break;c=e[0],s=s.substring(c.length);let b=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,he=>" ".repeat(3*he.length)),g=s.split(`
`,1)[0],y=!b.trim(),k=0;if(this.options.pedantic?(k=2,f=b.trimStart()):y?k=e[1].length+1:(k=e[2].search(this.rules.other.nonSpaceChar),k=k>4?1:k,f=b.slice(k),k+=e[1].length),y&&this.rules.other.blankLine.test(g)&&(c+=g+`
`,s=s.substring(g.length+1),p=!0),!p){let he=this.rules.other.nextBulletRegex(k),Ee=this.rules.other.hrRegex(k),X=this.rules.other.fencesBeginRegex(k),A=this.rules.other.headingBeginRegex(k),K=this.rules.other.htmlBeginRegex(k);for(;s;){let V=s.split(`
`,1)[0],Q;if(g=V,this.options.pedantic?(g=g.replace(this.rules.other.listReplaceNesting,"  "),Q=g):Q=g.replace(this.rules.other.tabCharGlobal,"    "),X.test(g)||A.test(g)||K.test(g)||he.test(g)||Ee.test(g))break;if(Q.search(this.rules.other.nonSpaceChar)>=k||!g.trim())f+=`
`+Q.slice(k);else{if(y||b.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||X.test(b)||A.test(b)||Ee.test(b))break;f+=`
`+g}!y&&!g.trim()&&(y=!0),c+=V+`
`,s=s.substring(V.length+1),b=Q.slice(k)}}n.loose||(a?n.loose=!0:this.rules.other.doubleBlankLine.test(c)&&(a=!0));let P=null,ye;this.options.gfm&&(P=this.rules.other.listIsTask.exec(f),P&&(ye=P[0]!=="[ ] ",f=f.replace(this.rules.other.listReplaceTask,""))),n.items.push({type:"list_item",raw:c,task:!!P,checked:ye,loose:!1,text:f,tokens:[]}),n.raw+=c}let l=n.items.at(-1);if(l)l.raw=l.raw.trimEnd(),l.text=l.text.trimEnd();else return;n.raw=n.raw.trimEnd();for(let p=0;p<n.items.length;p++)if(this.lexer.state.top=!1,n.items[p].tokens=this.lexer.blockTokens(n.items[p].text,[]),!n.loose){let c=n.items[p].tokens.filter(b=>b.type==="space"),f=c.length>0&&c.some(b=>this.rules.other.anyLine.test(b.raw));n.loose=f}if(n.loose)for(let p=0;p<n.items.length;p++)n.items[p].loose=!0;return n}}html(s){let e=this.rules.block.html.exec(s);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(s){let e=this.rules.block.def.exec(s);if(e){let t=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),i=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:t,raw:e[0],href:i,title:n}}}table(s){let e=this.rules.block.table.exec(s);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let t=nn(e[1]),i=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),n=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],o={type:"table",raw:e[0],header:[],align:[],rows:[]};if(t.length===i.length){for(let a of i)this.rules.other.tableAlignRight.test(a)?o.align.push("right"):this.rules.other.tableAlignCenter.test(a)?o.align.push("center"):this.rules.other.tableAlignLeft.test(a)?o.align.push("left"):o.align.push(null);for(let a=0;a<t.length;a++)o.header.push({text:t[a],tokens:this.lexer.inline(t[a]),header:!0,align:o.align[a]});for(let a of n)o.rows.push(nn(a,o.header.length).map((l,p)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:o.align[p]})));return o}}lheading(s){let e=this.rules.block.lheading.exec(s);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(s){let e=this.rules.block.paragraph.exec(s);if(e){let t=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:t,tokens:this.lexer.inline(t)}}}text(s){let e=this.rules.block.text.exec(s);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(s){let e=this.rules.inline.escape.exec(s);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(s){let e=this.rules.inline.tag.exec(s);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(s){let e=this.rules.inline.link.exec(s);if(e){let t=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(t)){if(!this.rules.other.endAngleBracket.test(t))return;let o=ge(t.slice(0,-1),"\\");if((t.length-o.length)%2===0)return}else{let o=As(e[2],"()");if(o===-2)return;if(o>-1){let l=(e[0].indexOf("!")===0?5:4)+e[1].length+o;e[2]=e[2].substring(0,o),e[0]=e[0].substring(0,l).trim(),e[3]=""}}let i=e[2],n="";if(this.options.pedantic){let o=this.rules.other.pedanticHrefTitle.exec(i);o&&(i=o[1],n=o[3])}else n=e[3]?e[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(t)?i=i.slice(1):i=i.slice(1,-1)),sn(e,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:n&&n.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(s,e){let t;if((t=this.rules.inline.reflink.exec(s))||(t=this.rules.inline.nolink.exec(s))){let i=(t[2]||t[1]).replace(this.rules.other.multipleSpaceGlobal," "),n=e[i.toLowerCase()];if(!n){let o=t[0].charAt(0);return{type:"text",raw:o,text:o}}return sn(t,n,t[0],this.lexer,this.rules)}}emStrong(s,e,t=""){let i=this.rules.inline.emStrongLDelim.exec(s);if(!i||i[3]&&t.match(this.rules.other.unicodeAlphaNumeric))return;if(!(i[1]||i[2]||"")||!t||this.rules.inline.punctuation.exec(t)){let o=[...i[0]].length-1,a,l,p=o,c=0,f=i[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(f.lastIndex=0,e=e.slice(-1*s.length+o);(i=f.exec(e))!=null;){if(a=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!a)continue;if(l=[...a].length,i[3]||i[4]){p+=l;continue}else if((i[5]||i[6])&&o%3&&!((o+l)%3)){c+=l;continue}if(p-=l,p>0)continue;l=Math.min(l,l+p+c);let b=[...i[0]][0].length,g=s.slice(0,o+i.index+b+l);if(Math.min(o,l)%2){let k=g.slice(1,-1);return{type:"em",raw:g,text:k,tokens:this.lexer.inlineTokens(k)}}let y=g.slice(2,-2);return{type:"strong",raw:g,text:y,tokens:this.lexer.inlineTokens(y)}}}}codespan(s){let e=this.rules.inline.code.exec(s);if(e){let t=e[2].replace(this.rules.other.newLineCharGlobal," "),i=this.rules.other.nonSpaceChar.test(t),n=this.rules.other.startingSpaceChar.test(t)&&this.rules.other.endingSpaceChar.test(t);return i&&n&&(t=t.substring(1,t.length-1)),{type:"codespan",raw:e[0],text:t}}}br(s){let e=this.rules.inline.br.exec(s);if(e)return{type:"br",raw:e[0]}}del(s){let e=this.rules.inline.del.exec(s);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(s){let e=this.rules.inline.autolink.exec(s);if(e){let t,i;return e[2]==="@"?(t=e[1],i="mailto:"+t):(t=e[1],i=t),{type:"link",raw:e[0],text:t,href:i,tokens:[{type:"text",raw:t,text:t}]}}}url(s){let e;if(e=this.rules.inline.url.exec(s)){let t,i;if(e[2]==="@")t=e[0],i="mailto:"+t;else{let n;do n=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(n!==e[0]);t=e[0],e[1]==="www."?i="http://"+e[0]:i=e[0]}return{type:"link",raw:e[0],text:t,href:i,tokens:[{type:"text",raw:t,text:t}]}}}inlineText(s){let e=this.rules.inline.text.exec(s);if(e){let t=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:t}}}},Z=class at{tokens;options;state;tokenizer;inlineQueue;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||ne,this.options.tokenizer=this.options.tokenizer||new Pe,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let t={other:O,block:Me.normal,inline:fe.normal};this.options.pedantic?(t.block=Me.pedantic,t.inline=fe.pedantic):this.options.gfm&&(t.block=Me.gfm,this.options.breaks?t.inline=fe.breaks:t.inline=fe.gfm),this.tokenizer.rules=t}static get rules(){return{block:Me,inline:fe}}static lex(e,t){return new at(t).lex(e)}static lexInline(e,t){return new at(t).inlineTokens(e)}lex(e){e=e.replace(O.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){let i=this.inlineQueue[t];this.inlineTokens(i.src,i.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],i=!1){for(this.options.pedantic&&(e=e.replace(O.tabCharGlobal,"    ").replace(O.spaceLine,""));e;){let n;if(this.options.extensions?.block?.some(a=>(n=a.call({lexer:this},e,t))?(e=e.substring(n.raw.length),t.push(n),!0):!1))continue;if(n=this.tokenizer.space(e)){e=e.substring(n.raw.length);let a=t.at(-1);n.raw.length===1&&a!==void 0?a.raw+=`
`:t.push(n);continue}if(n=this.tokenizer.code(e)){e=e.substring(n.raw.length);let a=t.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=`
`+n.raw,a.text+=`
`+n.text,this.inlineQueue.at(-1).src=a.text):t.push(n);continue}if(n=this.tokenizer.fences(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.heading(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.hr(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.blockquote(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.list(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.html(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.def(e)){e=e.substring(n.raw.length);let a=t.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=`
`+n.raw,a.text+=`
`+n.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[n.tag]||(this.tokens.links[n.tag]={href:n.href,title:n.title});continue}if(n=this.tokenizer.table(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.lheading(e)){e=e.substring(n.raw.length),t.push(n);continue}let o=e;if(this.options.extensions?.startBlock){let a=1/0,l=e.slice(1),p;this.options.extensions.startBlock.forEach(c=>{p=c.call({lexer:this},l),typeof p=="number"&&p>=0&&(a=Math.min(a,p))}),a<1/0&&a>=0&&(o=e.substring(0,a+1))}if(this.state.top&&(n=this.tokenizer.paragraph(o))){let a=t.at(-1);i&&a?.type==="paragraph"?(a.raw+=`
`+n.raw,a.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):t.push(n),i=o.length!==e.length,e=e.substring(n.raw.length);continue}if(n=this.tokenizer.text(e)){e=e.substring(n.raw.length);let a=t.at(-1);a?.type==="text"?(a.raw+=`
`+n.raw,a.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):t.push(n);continue}if(e){let a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let i=e,n=null;if(this.tokens.links){let l=Object.keys(this.tokens.links);if(l.length>0)for(;(n=this.tokenizer.rules.inline.reflinkSearch.exec(i))!=null;)l.includes(n[0].slice(n[0].lastIndexOf("[")+1,-1))&&(i=i.slice(0,n.index)+"["+"a".repeat(n[0].length-2)+"]"+i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(n=this.tokenizer.rules.inline.anyPunctuation.exec(i))!=null;)i=i.slice(0,n.index)+"++"+i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;(n=this.tokenizer.rules.inline.blockSkip.exec(i))!=null;)i=i.slice(0,n.index)+"["+"a".repeat(n[0].length-2)+"]"+i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);let o=!1,a="";for(;e;){o||(a=""),o=!1;let l;if(this.options.extensions?.inline?.some(c=>(l=c.call({lexer:this},e,t))?(e=e.substring(l.raw.length),t.push(l),!0):!1))continue;if(l=this.tokenizer.escape(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.tag(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.link(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(l.raw.length);let c=t.at(-1);l.type==="text"&&c?.type==="text"?(c.raw+=l.raw,c.text+=l.text):t.push(l);continue}if(l=this.tokenizer.emStrong(e,i,a)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.codespan(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.br(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.del(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.autolink(e)){e=e.substring(l.raw.length),t.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(e))){e=e.substring(l.raw.length),t.push(l);continue}let p=e;if(this.options.extensions?.startInline){let c=1/0,f=e.slice(1),b;this.options.extensions.startInline.forEach(g=>{b=g.call({lexer:this},f),typeof b=="number"&&b>=0&&(c=Math.min(c,b))}),c<1/0&&c>=0&&(p=e.substring(0,c+1))}if(l=this.tokenizer.inlineText(p)){e=e.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(a=l.raw.slice(-1)),o=!0;let c=t.at(-1);c?.type==="text"?(c.raw+=l.raw,c.text+=l.text):t.push(l);continue}if(e){let c="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return t}},ze=class{options;parser;constructor(s){this.options=s||ne}space(s){return""}code({text:s,lang:e,escaped:t}){let i=(e||"").match(O.notSpaceStart)?.[0],n=s.replace(O.endingNewline,"")+`
`;return i?'<pre><code class="language-'+H(i)+'">'+(t?n:H(n,!0))+`</code></pre>
`:"<pre><code>"+(t?n:H(n,!0))+`</code></pre>
`}blockquote({tokens:s}){return`<blockquote>
${this.parser.parse(s)}</blockquote>
`}html({text:s}){return s}heading({tokens:s,depth:e}){return`<h${e}>${this.parser.parseInline(s)}</h${e}>
`}hr(s){return`<hr>
`}list(s){let e=s.ordered,t=s.start,i="";for(let a=0;a<s.items.length;a++){let l=s.items[a];i+=this.listitem(l)}let n=e?"ol":"ul",o=e&&t!==1?' start="'+t+'"':"";return"<"+n+o+`>
`+i+"</"+n+`>
`}listitem(s){let e="";if(s.task){let t=this.checkbox({checked:!!s.checked});s.loose?s.tokens[0]?.type==="paragraph"?(s.tokens[0].text=t+" "+s.tokens[0].text,s.tokens[0].tokens&&s.tokens[0].tokens.length>0&&s.tokens[0].tokens[0].type==="text"&&(s.tokens[0].tokens[0].text=t+" "+H(s.tokens[0].tokens[0].text),s.tokens[0].tokens[0].escaped=!0)):s.tokens.unshift({type:"text",raw:t+" ",text:t+" ",escaped:!0}):e+=t+" "}return e+=this.parser.parse(s.tokens,!!s.loose),`<li>${e}</li>
`}checkbox({checked:s}){return"<input "+(s?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:s}){return`<p>${this.parser.parseInline(s)}</p>
`}table(s){let e="",t="";for(let n=0;n<s.header.length;n++)t+=this.tablecell(s.header[n]);e+=this.tablerow({text:t});let i="";for(let n=0;n<s.rows.length;n++){let o=s.rows[n];t="";for(let a=0;a<o.length;a++)t+=this.tablecell(o[a]);i+=this.tablerow({text:t})}return i&&(i=`<tbody>${i}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+i+`</table>
`}tablerow({text:s}){return`<tr>
${s}</tr>
`}tablecell(s){let e=this.parser.parseInline(s.tokens),t=s.header?"th":"td";return(s.align?`<${t} align="${s.align}">`:`<${t}>`)+e+`</${t}>
`}strong({tokens:s}){return`<strong>${this.parser.parseInline(s)}</strong>`}em({tokens:s}){return`<em>${this.parser.parseInline(s)}</em>`}codespan({text:s}){return`<code>${H(s,!0)}</code>`}br(s){return"<br>"}del({tokens:s}){return`<del>${this.parser.parseInline(s)}</del>`}link({href:s,title:e,tokens:t}){let i=this.parser.parseInline(t),n=tn(s);if(n===null)return i;s=n;let o='<a href="'+s+'"';return e&&(o+=' title="'+H(e)+'"'),o+=">"+i+"</a>",o}image({href:s,title:e,text:t,tokens:i}){i&&(t=this.parser.parseInline(i,this.parser.textRenderer));let n=tn(s);if(n===null)return H(t);s=n;let o=`<img src="${s}" alt="${t}"`;return e&&(o+=` title="${H(e)}"`),o+=">",o}text(s){return"tokens"in s&&s.tokens?this.parser.parseInline(s.tokens):"escaped"in s&&s.escaped?s.text:H(s.text)}},bt=class{strong({text:s}){return s}em({text:s}){return s}codespan({text:s}){return s}del({text:s}){return s}html({text:s}){return s}text({text:s}){return s}link({text:s}){return""+s}image({text:s}){return""+s}br(){return""}},Y=class lt{options;renderer;textRenderer;constructor(e){this.options=e||ne,this.options.renderer=this.options.renderer||new ze,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new bt}static parse(e,t){return new lt(t).parse(e)}static parseInline(e,t){return new lt(t).parseInline(e)}parse(e,t=!0){let i="";for(let n=0;n<e.length;n++){let o=e[n];if(this.options.extensions?.renderers?.[o.type]){let l=o,p=this.options.extensions.renderers[l.type].call({parser:this},l);if(p!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(l.type)){i+=p||"";continue}}let a=o;switch(a.type){case"space":{i+=this.renderer.space(a);continue}case"hr":{i+=this.renderer.hr(a);continue}case"heading":{i+=this.renderer.heading(a);continue}case"code":{i+=this.renderer.code(a);continue}case"table":{i+=this.renderer.table(a);continue}case"blockquote":{i+=this.renderer.blockquote(a);continue}case"list":{i+=this.renderer.list(a);continue}case"html":{i+=this.renderer.html(a);continue}case"paragraph":{i+=this.renderer.paragraph(a);continue}case"text":{let l=a,p=this.renderer.text(l);for(;n+1<e.length&&e[n+1].type==="text";)l=e[++n],p+=`
`+this.renderer.text(l);t?i+=this.renderer.paragraph({type:"paragraph",raw:p,text:p,tokens:[{type:"text",raw:p,text:p,escaped:!0}]}):i+=p;continue}default:{let l='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return i}parseInline(e,t=this.renderer){let i="";for(let n=0;n<e.length;n++){let o=e[n];if(this.options.extensions?.renderers?.[o.type]){let l=this.options.extensions.renderers[o.type].call({parser:this},o);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(o.type)){i+=l||"";continue}}let a=o;switch(a.type){case"escape":{i+=t.text(a);break}case"html":{i+=t.html(a);break}case"link":{i+=t.link(a);break}case"image":{i+=t.image(a);break}case"strong":{i+=t.strong(a);break}case"em":{i+=t.em(a);break}case"codespan":{i+=t.codespan(a);break}case"br":{i+=t.br(a);break}case"del":{i+=t.del(a);break}case"text":{i+=t.text(a);break}default:{let l='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return i}},De=class{options;block;constructor(s){this.options=s||ne}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(s){return s}postprocess(s){return s}processAllTokens(s){return s}provideLexer(){return this.block?Z.lex:Z.lexInline}provideParser(){return this.block?Y.parse:Y.parseInline}},vs=class{defaults=ct();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Y;Renderer=ze;TextRenderer=bt;Lexer=Z;Tokenizer=Pe;Hooks=De;constructor(...s){this.use(...s)}walkTokens(s,e){let t=[];for(let i of s)switch(t=t.concat(e.call(this,i)),i.type){case"table":{let n=i;for(let o of n.header)t=t.concat(this.walkTokens(o.tokens,e));for(let o of n.rows)for(let a of o)t=t.concat(this.walkTokens(a.tokens,e));break}case"list":{let n=i;t=t.concat(this.walkTokens(n.items,e));break}default:{let n=i;this.defaults.extensions?.childTokens?.[n.type]?this.defaults.extensions.childTokens[n.type].forEach(o=>{let a=n[o].flat(1/0);t=t.concat(this.walkTokens(a,e))}):n.tokens&&(t=t.concat(this.walkTokens(n.tokens,e)))}}return t}use(...s){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return s.forEach(t=>{let i={...t};if(i.async=this.defaults.async||i.async||!1,t.extensions&&(t.extensions.forEach(n=>{if(!n.name)throw new Error("extension name required");if("renderer"in n){let o=e.renderers[n.name];o?e.renderers[n.name]=function(...a){let l=n.renderer.apply(this,a);return l===!1&&(l=o.apply(this,a)),l}:e.renderers[n.name]=n.renderer}if("tokenizer"in n){if(!n.level||n.level!=="block"&&n.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let o=e[n.level];o?o.unshift(n.tokenizer):e[n.level]=[n.tokenizer],n.start&&(n.level==="block"?e.startBlock?e.startBlock.push(n.start):e.startBlock=[n.start]:n.level==="inline"&&(e.startInline?e.startInline.push(n.start):e.startInline=[n.start]))}"childTokens"in n&&n.childTokens&&(e.childTokens[n.name]=n.childTokens)}),i.extensions=e),t.renderer){let n=this.defaults.renderer||new ze(this.defaults);for(let o in t.renderer){if(!(o in n))throw new Error(`renderer '${o}' does not exist`);if(["options","parser"].includes(o))continue;let a=o,l=t.renderer[a],p=n[a];n[a]=(...c)=>{let f=l.apply(n,c);return f===!1&&(f=p.apply(n,c)),f||""}}i.renderer=n}if(t.tokenizer){let n=this.defaults.tokenizer||new Pe(this.defaults);for(let o in t.tokenizer){if(!(o in n))throw new Error(`tokenizer '${o}' does not exist`);if(["options","rules","lexer"].includes(o))continue;let a=o,l=t.tokenizer[a],p=n[a];n[a]=(...c)=>{let f=l.apply(n,c);return f===!1&&(f=p.apply(n,c)),f}}i.tokenizer=n}if(t.hooks){let n=this.defaults.hooks||new De;for(let o in t.hooks){if(!(o in n))throw new Error(`hook '${o}' does not exist`);if(["options","block"].includes(o))continue;let a=o,l=t.hooks[a],p=n[a];De.passThroughHooks.has(o)?n[a]=c=>{if(this.defaults.async)return Promise.resolve(l.call(n,c)).then(b=>p.call(n,b));let f=l.call(n,c);return p.call(n,f)}:n[a]=(...c)=>{let f=l.apply(n,c);return f===!1&&(f=p.apply(n,c)),f}}i.hooks=n}if(t.walkTokens){let n=this.defaults.walkTokens,o=t.walkTokens;i.walkTokens=function(a){let l=[];return l.push(o.call(this,a)),n&&(l=l.concat(n.call(this,a))),l}}this.defaults={...this.defaults,...i}}),this}setOptions(s){return this.defaults={...this.defaults,...s},this}lexer(s,e){return Z.lex(s,e??this.defaults)}parser(s,e){return Y.parse(s,e??this.defaults)}parseMarkdown(s){return(t,i)=>{let n={...i},o={...this.defaults,...n},a=this.onError(!!o.silent,!!o.async);if(this.defaults.async===!0&&n.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));o.hooks&&(o.hooks.options=o,o.hooks.block=s);let l=o.hooks?o.hooks.provideLexer():s?Z.lex:Z.lexInline,p=o.hooks?o.hooks.provideParser():s?Y.parse:Y.parseInline;if(o.async)return Promise.resolve(o.hooks?o.hooks.preprocess(t):t).then(c=>l(c,o)).then(c=>o.hooks?o.hooks.processAllTokens(c):c).then(c=>o.walkTokens?Promise.all(this.walkTokens(c,o.walkTokens)).then(()=>c):c).then(c=>p(c,o)).then(c=>o.hooks?o.hooks.postprocess(c):c).catch(a);try{o.hooks&&(t=o.hooks.preprocess(t));let c=l(t,o);o.hooks&&(c=o.hooks.processAllTokens(c)),o.walkTokens&&this.walkTokens(c,o.walkTokens);let f=p(c,o);return o.hooks&&(f=o.hooks.postprocess(f)),f}catch(c){return a(c)}}}onError(s,e){return t=>{if(t.message+=`
Please report this to https://github.com/markedjs/marked.`,s){let i="<p>An error occurred:</p><pre>"+H(t.message+"",!0)+"</pre>";return e?Promise.resolve(i):i}if(e)return Promise.reject(t);throw t}}},te=new vs;function x(s,e){return te.parse(s,e)}x.options=x.setOptions=function(s){return te.setOptions(s),x.defaults=te.defaults,rn(x.defaults),x};x.getDefaults=ct;x.defaults=ne;x.use=function(...s){return te.use(...s),x.defaults=te.defaults,rn(x.defaults),x};x.walkTokens=function(s,e){return te.walkTokens(s,e)};x.parseInline=te.parseInline;x.Parser=Y;x.parser=Y.parse;x.Renderer=ze;x.TextRenderer=bt;x.Lexer=Z;x.lexer=Z.lex;x.Tokenizer=Pe;x.Hooks=De;x.parse=x;var ni=x.options,si=x.setOptions,ii=x.use,ri=x.walkTokens,oi=x.parseInline;var ai=Y.parse,li=Z.lex;var{entries:En,setPrototypeOf:mn,isFrozen:Cs,getPrototypeOf:Ls,getOwnPropertyDescriptor:Is}=Object,{freeze:D,seal:$,create:Et}=Object,{apply:St,construct:At}=typeof Reflect<"u"&&Reflect;D||(D=function(e){return e});$||($=function(e){return e});St||(St=function(e,t){for(var i=arguments.length,n=new Array(i>2?i-2:0),o=2;o<i;o++)n[o-2]=arguments[o];return e.apply(t,n)});At||(At=function(e){for(var t=arguments.length,i=new Array(t>1?t-1:0),n=1;n<t;n++)i[n-1]=arguments[n];return new e(...i)});var Ue=N(Array.prototype.forEach),Os=N(Array.prototype.lastIndexOf),bn=N(Array.prototype.pop),xe=N(Array.prototype.push),Ms=N(Array.prototype.splice),He=N(String.prototype.toLowerCase),xt=N(String.prototype.toString),kt=N(String.prototype.match),ke=N(String.prototype.replace),Ds=N(String.prototype.indexOf),Ns=N(String.prototype.trim),F=N(Object.prototype.hasOwnProperty),M=N(RegExp.prototype.test),we=Ps(TypeError);function N(s){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var t=arguments.length,i=new Array(t>1?t-1:0),n=1;n<t;n++)i[n-1]=arguments[n];return St(s,e,i)}}function Ps(s){return function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];return At(s,t)}}function m(s,e){let t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:He;mn&&mn(s,null);let i=e.length;for(;i--;){let n=e[i];if(typeof n=="string"){let o=t(n);o!==n&&(Cs(e)||(e[i]=o),n=o)}s[n]=!0}return s}function zs(s){for(let e=0;e<s.length;e++)F(s,e)||(s[e]=null);return s}function G(s){let e=Et(null);for(let[t,i]of En(s))F(s,t)&&(Array.isArray(i)?e[t]=zs(i):i&&typeof i=="object"&&i.constructor===Object?e[t]=G(i):e[t]=i);return e}function Te(s,e){for(;s!==null;){let i=Is(s,e);if(i){if(i.get)return N(i.get);if(typeof i.value=="function")return N(i.value)}s=Ls(s)}function t(){return null}return t}var xn=D(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),wt=D(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Tt=D(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),$s=D(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),_t=D(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Fs=D(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),kn=D(["#text"]),wn=D(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),yt=D(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Tn=D(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Be=D(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Us=$(/\{\{[\w\W]*|[\w\W]*\}\}/gm),Bs=$(/<%[\w\W]*|[\w\W]*%>/gm),Hs=$(/\$\{[\w\W]*/gm),Gs=$(/^data-[\-\w.\u00B7-\uFFFF]+$/),qs=$(/^aria-[\-\w]+$/),Sn=$(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Ws=$(/^(?:\w+script|data):/i),js=$(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),An=$(/^html$/i),Zs=$(/^[a-z][.\w]*(-[.\w]+)+$/i),_n=Object.freeze({__proto__:null,ARIA_ATTR:qs,ATTR_WHITESPACE:js,CUSTOM_ELEMENT:Zs,DATA_ATTR:Gs,DOCTYPE_NAME:An,ERB_EXPR:Bs,IS_ALLOWED_URI:Sn,IS_SCRIPT_OR_DATA:Ws,MUSTACHE_EXPR:Us,TMPLIT_EXPR:Hs}),_e={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,progressingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},Ys=function(){return typeof window>"u"?null:window},Xs=function(e,t){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let i=null,n="data-tt-policy-suffix";t&&t.hasAttribute(n)&&(i=t.getAttribute(n));let o="dompurify"+(i?"#"+i:"");try{return e.createPolicy(o,{createHTML(a){return a},createScriptURL(a){return a}})}catch{return console.warn("TrustedTypes policy "+o+" could not be created."),null}},yn=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function Rn(){let s=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Ys(),e=d=>Rn(d);if(e.version="3.3.1",e.removed=[],!s||!s.document||s.document.nodeType!==_e.document||!s.Element)return e.isSupported=!1,e;let{document:t}=s,i=t,n=i.currentScript,{DocumentFragment:o,HTMLTemplateElement:a,Node:l,Element:p,NodeFilter:c,NamedNodeMap:f=s.NamedNodeMap||s.MozNamedAttrMap,HTMLFormElement:b,DOMParser:g,trustedTypes:y}=s,k=p.prototype,P=Te(k,"cloneNode"),ye=Te(k,"remove"),he=Te(k,"nextSibling"),Ee=Te(k,"childNodes"),X=Te(k,"parentNode");if(typeof a=="function"){let d=t.createElement("template");d.content&&d.content.ownerDocument&&(t=d.content.ownerDocument)}let A,K="",{implementation:V,createNodeIterator:Q,createDocumentFragment:On,getElementsByTagName:Mn}=t,{importNode:Dn}=i,I=yn();e.isSupported=typeof En=="function"&&typeof X=="function"&&V&&V.createHTMLDocument!==void 0;let{MUSTACHE_EXPR:We,ERB_EXPR:je,TMPLIT_EXPR:Ze,DATA_ATTR:Nn,ARIA_ATTR:Pn,IS_SCRIPT_OR_DATA:zn,ATTR_WHITESPACE:Ct,CUSTOM_ELEMENT:$n}=_n,{IS_ALLOWED_URI:Lt}=_n,R=null,It=m({},[...xn,...wt,...Tt,..._t,...kn]),v=null,Ot=m({},[...wn,...yt,...Tn,...Be]),_=Object.seal(Et(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),pe=null,Ye=null,se=Object.seal(Et(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),Mt=!0,Xe=!0,Dt=!1,Nt=!0,ie=!1,Se=!0,J=!1,Ke=!1,Ve=!1,re=!1,Ae=!1,Re=!1,Pt=!0,zt=!1,Fn="user-content-",Qe=!0,ue=!1,oe={},U=null,Je=m({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),$t=null,Ft=m({},["audio","video","img","source","image","track"]),et=null,Ut=m({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),ve="http://www.w3.org/1998/Math/MathML",Ce="http://www.w3.org/2000/svg",q="http://www.w3.org/1999/xhtml",ae=q,tt=!1,nt=null,Un=m({},[ve,Ce,q],xt),Le=m({},["mi","mo","mn","ms","mtext"]),Ie=m({},["annotation-xml"]),Bn=m({},["title","style","font","a","script"]),de=null,Hn=["application/xhtml+xml","text/html"],Gn="text/html",S=null,le=null,qn=t.createElement("form"),Bt=function(r){return r instanceof RegExp||r instanceof Function},st=function(){let r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(le&&le===r)){if((!r||typeof r!="object")&&(r={}),r=G(r),de=Hn.indexOf(r.PARSER_MEDIA_TYPE)===-1?Gn:r.PARSER_MEDIA_TYPE,S=de==="application/xhtml+xml"?xt:He,R=F(r,"ALLOWED_TAGS")?m({},r.ALLOWED_TAGS,S):It,v=F(r,"ALLOWED_ATTR")?m({},r.ALLOWED_ATTR,S):Ot,nt=F(r,"ALLOWED_NAMESPACES")?m({},r.ALLOWED_NAMESPACES,xt):Un,et=F(r,"ADD_URI_SAFE_ATTR")?m(G(Ut),r.ADD_URI_SAFE_ATTR,S):Ut,$t=F(r,"ADD_DATA_URI_TAGS")?m(G(Ft),r.ADD_DATA_URI_TAGS,S):Ft,U=F(r,"FORBID_CONTENTS")?m({},r.FORBID_CONTENTS,S):Je,pe=F(r,"FORBID_TAGS")?m({},r.FORBID_TAGS,S):G({}),Ye=F(r,"FORBID_ATTR")?m({},r.FORBID_ATTR,S):G({}),oe=F(r,"USE_PROFILES")?r.USE_PROFILES:!1,Mt=r.ALLOW_ARIA_ATTR!==!1,Xe=r.ALLOW_DATA_ATTR!==!1,Dt=r.ALLOW_UNKNOWN_PROTOCOLS||!1,Nt=r.ALLOW_SELF_CLOSE_IN_ATTR!==!1,ie=r.SAFE_FOR_TEMPLATES||!1,Se=r.SAFE_FOR_XML!==!1,J=r.WHOLE_DOCUMENT||!1,re=r.RETURN_DOM||!1,Ae=r.RETURN_DOM_FRAGMENT||!1,Re=r.RETURN_TRUSTED_TYPE||!1,Ve=r.FORCE_BODY||!1,Pt=r.SANITIZE_DOM!==!1,zt=r.SANITIZE_NAMED_PROPS||!1,Qe=r.KEEP_CONTENT!==!1,ue=r.IN_PLACE||!1,Lt=r.ALLOWED_URI_REGEXP||Sn,ae=r.NAMESPACE||q,Le=r.MATHML_TEXT_INTEGRATION_POINTS||Le,Ie=r.HTML_INTEGRATION_POINTS||Ie,_=r.CUSTOM_ELEMENT_HANDLING||{},r.CUSTOM_ELEMENT_HANDLING&&Bt(r.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(_.tagNameCheck=r.CUSTOM_ELEMENT_HANDLING.tagNameCheck),r.CUSTOM_ELEMENT_HANDLING&&Bt(r.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(_.attributeNameCheck=r.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),r.CUSTOM_ELEMENT_HANDLING&&typeof r.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(_.allowCustomizedBuiltInElements=r.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),ie&&(Xe=!1),Ae&&(re=!0),oe&&(R=m({},kn),v=[],oe.html===!0&&(m(R,xn),m(v,wn)),oe.svg===!0&&(m(R,wt),m(v,yt),m(v,Be)),oe.svgFilters===!0&&(m(R,Tt),m(v,yt),m(v,Be)),oe.mathMl===!0&&(m(R,_t),m(v,Tn),m(v,Be))),r.ADD_TAGS&&(typeof r.ADD_TAGS=="function"?se.tagCheck=r.ADD_TAGS:(R===It&&(R=G(R)),m(R,r.ADD_TAGS,S))),r.ADD_ATTR&&(typeof r.ADD_ATTR=="function"?se.attributeCheck=r.ADD_ATTR:(v===Ot&&(v=G(v)),m(v,r.ADD_ATTR,S))),r.ADD_URI_SAFE_ATTR&&m(et,r.ADD_URI_SAFE_ATTR,S),r.FORBID_CONTENTS&&(U===Je&&(U=G(U)),m(U,r.FORBID_CONTENTS,S)),r.ADD_FORBID_CONTENTS&&(U===Je&&(U=G(U)),m(U,r.ADD_FORBID_CONTENTS,S)),Qe&&(R["#text"]=!0),J&&m(R,["html","head","body"]),R.table&&(m(R,["tbody"]),delete pe.tbody),r.TRUSTED_TYPES_POLICY){if(typeof r.TRUSTED_TYPES_POLICY.createHTML!="function")throw we('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof r.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw we('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');A=r.TRUSTED_TYPES_POLICY,K=A.createHTML("")}else A===void 0&&(A=Xs(y,n)),A!==null&&typeof K=="string"&&(K=A.createHTML(""));D&&D(r),le=r}},Ht=m({},[...wt,...Tt,...$s]),Gt=m({},[..._t,...Fs]),Wn=function(r){let h=X(r);(!h||!h.tagName)&&(h={namespaceURI:ae,tagName:"template"});let u=He(r.tagName),T=He(h.tagName);return nt[r.namespaceURI]?r.namespaceURI===Ce?h.namespaceURI===q?u==="svg":h.namespaceURI===ve?u==="svg"&&(T==="annotation-xml"||Le[T]):!!Ht[u]:r.namespaceURI===ve?h.namespaceURI===q?u==="math":h.namespaceURI===Ce?u==="math"&&Ie[T]:!!Gt[u]:r.namespaceURI===q?h.namespaceURI===Ce&&!Ie[T]||h.namespaceURI===ve&&!Le[T]?!1:!Gt[u]&&(Bn[u]||!Ht[u]):!!(de==="application/xhtml+xml"&&nt[r.namespaceURI]):!1},B=function(r){xe(e.removed,{element:r});try{X(r).removeChild(r)}catch{ye(r)}},ee=function(r,h){try{xe(e.removed,{attribute:h.getAttributeNode(r),from:h})}catch{xe(e.removed,{attribute:null,from:h})}if(h.removeAttribute(r),r==="is")if(re||Ae)try{B(h)}catch{}else try{h.setAttribute(r,"")}catch{}},qt=function(r){let h=null,u=null;if(Ve)r="<remove></remove>"+r;else{let E=kt(r,/^[\r\n\t ]+/);u=E&&E[0]}de==="application/xhtml+xml"&&ae===q&&(r='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+r+"</body></html>");let T=A?A.createHTML(r):r;if(ae===q)try{h=new g().parseFromString(T,de)}catch{}if(!h||!h.documentElement){h=V.createDocument(ae,"template",null);try{h.documentElement.innerHTML=tt?K:T}catch{}}let L=h.body||h.documentElement;return r&&u&&L.insertBefore(t.createTextNode(u),L.childNodes[0]||null),ae===q?Mn.call(h,J?"html":"body")[0]:J?h.documentElement:L},Wt=function(r){return Q.call(r.ownerDocument||r,r,c.SHOW_ELEMENT|c.SHOW_COMMENT|c.SHOW_TEXT|c.SHOW_PROCESSING_INSTRUCTION|c.SHOW_CDATA_SECTION,null)},it=function(r){return r instanceof b&&(typeof r.nodeName!="string"||typeof r.textContent!="string"||typeof r.removeChild!="function"||!(r.attributes instanceof f)||typeof r.removeAttribute!="function"||typeof r.setAttribute!="function"||typeof r.namespaceURI!="string"||typeof r.insertBefore!="function"||typeof r.hasChildNodes!="function")},jt=function(r){return typeof l=="function"&&r instanceof l};function W(d,r,h){Ue(d,u=>{u.call(e,r,h,le)})}let Zt=function(r){let h=null;if(W(I.beforeSanitizeElements,r,null),it(r))return B(r),!0;let u=S(r.nodeName);if(W(I.uponSanitizeElement,r,{tagName:u,allowedTags:R}),Se&&r.hasChildNodes()&&!jt(r.firstElementChild)&&M(/<[/\w!]/g,r.innerHTML)&&M(/<[/\w!]/g,r.textContent)||r.nodeType===_e.progressingInstruction||Se&&r.nodeType===_e.comment&&M(/<[/\w]/g,r.data))return B(r),!0;if(!(se.tagCheck instanceof Function&&se.tagCheck(u))&&(!R[u]||pe[u])){if(!pe[u]&&Xt(u)&&(_.tagNameCheck instanceof RegExp&&M(_.tagNameCheck,u)||_.tagNameCheck instanceof Function&&_.tagNameCheck(u)))return!1;if(Qe&&!U[u]){let T=X(r)||r.parentNode,L=Ee(r)||r.childNodes;if(L&&T){let E=L.length;for(let z=E-1;z>=0;--z){let j=P(L[z],!0);j.__removalCount=(r.__removalCount||0)+1,T.insertBefore(j,he(r))}}}return B(r),!0}return r instanceof p&&!Wn(r)||(u==="noscript"||u==="noembed"||u==="noframes")&&M(/<\/no(script|embed|frames)/i,r.innerHTML)?(B(r),!0):(ie&&r.nodeType===_e.text&&(h=r.textContent,Ue([We,je,Ze],T=>{h=ke(h,T," ")}),r.textContent!==h&&(xe(e.removed,{element:r.cloneNode()}),r.textContent=h)),W(I.afterSanitizeElements,r,null),!1)},Yt=function(r,h,u){if(Pt&&(h==="id"||h==="name")&&(u in t||u in qn))return!1;if(!(Xe&&!Ye[h]&&M(Nn,h))){if(!(Mt&&M(Pn,h))){if(!(se.attributeCheck instanceof Function&&se.attributeCheck(h,r))){if(!v[h]||Ye[h]){if(!(Xt(r)&&(_.tagNameCheck instanceof RegExp&&M(_.tagNameCheck,r)||_.tagNameCheck instanceof Function&&_.tagNameCheck(r))&&(_.attributeNameCheck instanceof RegExp&&M(_.attributeNameCheck,h)||_.attributeNameCheck instanceof Function&&_.attributeNameCheck(h,r))||h==="is"&&_.allowCustomizedBuiltInElements&&(_.tagNameCheck instanceof RegExp&&M(_.tagNameCheck,u)||_.tagNameCheck instanceof Function&&_.tagNameCheck(u))))return!1}else if(!et[h]){if(!M(Lt,ke(u,Ct,""))){if(!((h==="src"||h==="xlink:href"||h==="href")&&r!=="script"&&Ds(u,"data:")===0&&$t[r])){if(!(Dt&&!M(zn,ke(u,Ct,"")))){if(u)return!1}}}}}}}return!0},Xt=function(r){return r!=="annotation-xml"&&kt(r,$n)},Kt=function(r){W(I.beforeSanitizeAttributes,r,null);let{attributes:h}=r;if(!h||it(r))return;let u={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:v,forceKeepAttr:void 0},T=h.length;for(;T--;){let L=h[T],{name:E,namespaceURI:z,value:j}=L,ce=S(E),rt=j,C=E==="value"?rt:Ns(rt);if(u.attrName=ce,u.attrValue=C,u.keepAttr=!0,u.forceKeepAttr=void 0,W(I.uponSanitizeAttribute,r,u),C=u.attrValue,zt&&(ce==="id"||ce==="name")&&(ee(E,r),C=Fn+C),Se&&M(/((--!?|])>)|<\/(style|title|textarea)/i,C)){ee(E,r);continue}if(ce==="attributename"&&kt(C,"href")){ee(E,r);continue}if(u.forceKeepAttr)continue;if(!u.keepAttr){ee(E,r);continue}if(!Nt&&M(/\/>/i,C)){ee(E,r);continue}ie&&Ue([We,je,Ze],Qt=>{C=ke(C,Qt," ")});let Vt=S(r.nodeName);if(!Yt(Vt,ce,C)){ee(E,r);continue}if(A&&typeof y=="object"&&typeof y.getAttributeType=="function"&&!z)switch(y.getAttributeType(Vt,ce)){case"TrustedHTML":{C=A.createHTML(C);break}case"TrustedScriptURL":{C=A.createScriptURL(C);break}}if(C!==rt)try{z?r.setAttributeNS(z,E,C):r.setAttribute(E,C),it(r)?B(r):bn(e.removed)}catch{ee(E,r)}}W(I.afterSanitizeAttributes,r,null)},jn=function d(r){let h=null,u=Wt(r);for(W(I.beforeSanitizeShadowDOM,r,null);h=u.nextNode();)W(I.uponSanitizeShadowNode,h,null),Zt(h),Kt(h),h.content instanceof o&&d(h.content);W(I.afterSanitizeShadowDOM,r,null)};return e.sanitize=function(d){let r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},h=null,u=null,T=null,L=null;if(tt=!d,tt&&(d="<!-->"),typeof d!="string"&&!jt(d))if(typeof d.toString=="function"){if(d=d.toString(),typeof d!="string")throw we("dirty is not a string, aborting")}else throw we("toString is not a function");if(!e.isSupported)return d;if(Ke||st(r),e.removed=[],typeof d=="string"&&(ue=!1),ue){if(d.nodeName){let j=S(d.nodeName);if(!R[j]||pe[j])throw we("root node is forbidden and cannot be sanitized in-place")}}else if(d instanceof l)h=qt("<!---->"),u=h.ownerDocument.importNode(d,!0),u.nodeType===_e.element&&u.nodeName==="BODY"||u.nodeName==="HTML"?h=u:h.appendChild(u);else{if(!re&&!ie&&!J&&d.indexOf("<")===-1)return A&&Re?A.createHTML(d):d;if(h=qt(d),!h)return re?null:Re?K:""}h&&Ve&&B(h.firstChild);let E=Wt(ue?d:h);for(;T=E.nextNode();)Zt(T),Kt(T),T.content instanceof o&&jn(T.content);if(ue)return d;if(re){if(Ae)for(L=On.call(h.ownerDocument);h.firstChild;)L.appendChild(h.firstChild);else L=h;return(v.shadowroot||v.shadowrootmode)&&(L=Dn.call(i,L,!0)),L}let z=J?h.outerHTML:h.innerHTML;return J&&R["!doctype"]&&h.ownerDocument&&h.ownerDocument.doctype&&h.ownerDocument.doctype.name&&M(An,h.ownerDocument.doctype.name)&&(z="<!DOCTYPE "+h.ownerDocument.doctype.name+`>
`+z),ie&&Ue([We,je,Ze],j=>{z=ke(z,j," ")}),A&&Re?A.createHTML(z):z},e.setConfig=function(){let d=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};st(d),Ke=!0},e.clearConfig=function(){le=null,Ke=!1},e.isValidAttribute=function(d,r,h){le||st({});let u=S(d),T=S(r);return Yt(u,T,h)},e.addHook=function(d,r){typeof r=="function"&&xe(I[d],r)},e.removeHook=function(d,r){if(r!==void 0){let h=Os(I[d],r);return h===-1?void 0:Ms(I[d],h,1)[0]}return bn(I[d])},e.removeHooks=function(d){I[d]=[]},e.removeAllHooks=function(){I=yn()},e}var vn=Rn();x.setOptions({gfm:!0,breaks:!0});var Ks=["p","br","strong","em","del","h1","h2","h3","h4","h5","h6","ul","ol","li","a","code","pre","blockquote","table","thead","tbody","tr","th","td","hr","img","span"],Vs=["href","target","rel","src","alt","title","class"];function Rt(s){if(!s)return"";let e=x.parse(s);return vn.sanitize(e,{ALLOWED_TAGS:Ks,ALLOWED_ATTR:Vs})}var Ge=class{constructor({onSend:e,shadowRoot:t}){this.onSend=e,this.shadowRoot=t,this.container=null,this.editor=null,this.toolbar=null}build(){return this.container=document.createElement("div"),this.container.className="sc-editor-container",this.toolbar=document.createElement("div"),this.toolbar.className="sc-toolbar",this._buildToolbar(),this.container.appendChild(this.toolbar),this.editor=document.createElement("div"),this.editor.className="sc-editor",this.editor.contentEditable="true",this.editor.setAttribute("role","textbox"),this.editor.setAttribute("aria-multiline","true"),this.editor.dataset.placeholder="Type a message...",this.container.appendChild(this.editor),this.editor.addEventListener("keydown",e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),this.onSend())}),this.container}_buildToolbar(){[{cmd:"bold",icon:"B",title:"Bold (Ctrl+B)",style:"font-weight:bold"},{cmd:"italic",icon:"I",title:"Italic (Ctrl+I)",style:"font-style:italic"},{cmd:"underline",icon:"U",title:"Underline (Ctrl+U)",style:"text-decoration:underline"},{cmd:"insertOrderedList",icon:"OL",title:"Ordered list"},{cmd:"insertUnorderedList",icon:"UL",title:"Unordered list"},{cmd:"code",icon:"</>",title:"Inline code",custom:!0},{cmd:"heading",icon:"H",title:"Heading",custom:!0},{cmd:"createLink",icon:"\u{1F517}",title:"Insert link",custom:!0}].forEach(({cmd:t,icon:i,title:n,style:o,custom:a})=>{let l=document.createElement("button");l.type="button",l.className="sc-toolbar-btn",l.innerHTML=i,l.title=n,o&&(l.style.cssText=o),l.addEventListener("mousedown",p=>{p.preventDefault(),a?this._handleCustomCommand(t):document.execCommand(t,!1,null)}),this.toolbar.appendChild(l)})}_handleCustomCommand(e){if(e==="code"){let t=this.shadowRoot.getSelection?this.shadowRoot.getSelection():document.getSelection();if(t&&t.rangeCount>0){let i=t.getRangeAt(0),n=document.createElement("code");try{i.surroundContents(n)}catch{n.textContent=t.toString(),i.deleteContents(),i.insertNode(n)}}}else if(e==="heading")document.execCommand("formatBlock",!1,"h3");else if(e==="createLink"){let t=prompt("Enter URL:");t&&document.execCommand("createLink",!1,t)}}getHTML(){return this.editor.innerHTML}isEmpty(){let e=this.editor.textContent.trim();return e===""||e===`
`}clear(){this.editor.innerHTML=""}focus(){this.editor.focus()}setEnabled(e){this.editor.contentEditable=e?"true":"false",this.container.classList.toggle("sc-editor-disabled",!e)}};function Ln(s){let e=document.createElement("div");return e.innerHTML=s,vt(e).trim()}function vt(s){let e="";for(let t of s.childNodes)if(t.nodeType===Node.TEXT_NODE)e+=t.textContent;else if(t.nodeType===Node.ELEMENT_NODE){let i=t.tagName.toLowerCase(),n=vt(t);switch(i){case"strong":case"b":e+=`**${n}**`;break;case"em":case"i":e+=`*${n}*`;break;case"u":e+=`__${n}__`;break;case"code":e+=`\`${n}\``;break;case"pre":e+=`
\`\`\`
${t.textContent}
\`\`\`
`;break;case"a":e+=`[${n}](${t.getAttribute("href")||""})`;break;case"h1":case"h2":case"h3":case"h4":case"h5":case"h6":{let o=parseInt(i[1]);e+=`
${"#".repeat(o)} ${n}
`;break}case"ul":e+=`
`+Cn(t,"ul")+`
`;break;case"ol":e+=`
`+Cn(t,"ol")+`
`;break;case"li":e+=n;break;case"br":e+=`
`;break;case"div":case"p":e+=`
${n}
`;break;default:e+=n}}return e}function Cn(s,e){let t="",i=1;for(let n of s.children)if(n.tagName.toLowerCase()==="li"){let o=e==="ol"?`${i++}. `:"- ";t+=o+vt(n).trim()+`
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

.sc-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sc-logo {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  object-fit: contain;
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

/* Login form */
.sc-login-form {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sc-login-form.sc-hidden {
  display: none;
}

.sc-login-title {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
  color: #374151;
}

.sc-login-email,
.sc-login-password {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.sc-login-email:focus,
.sc-login-password:focus {
  border-color: var(--sc-primary, #4F46E5);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.sc-login-btn {
  width: 100%;
  padding: 10px 16px;
  background: var(--sc-primary, #4F46E5);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 4px;
}

.sc-login-btn:hover {
  opacity: 0.9;
}

.sc-login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sc-login-error {
  background: #fee2e2;
  color: #991b1b;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  text-align: center;
}

.sc-login-error.sc-hidden {
  display: none;
}

/* Chat area wrapper */
.sc-chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sc-chat-area.sc-hidden {
  display: none;
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
`;var Js='<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>',ei="\u2715",qe=class{constructor(e,t,i,n,o=null){this.serverUrl=e,this.apiKey=t,this.config=i,this.userContext=n||{},this.authConfig=o,this.userToken=this._getSavedToken(),this.isOpen=!1,this.isStreaming=!1,this.isLoggedIn=!!this.userToken||!!n.user_id,this.sessionId=this._getSessionId(),this.wsClient=null,this.host=null,this.shadow=null,this.richEditor=null,this.loginFormEl=null,this.chatAreaEl=null}_getSavedToken(){return localStorage.getItem(`smartchat_token_${this.apiKey}`)}_saveToken(e){localStorage.setItem(`smartchat_token_${this.apiKey}`,e),this.userToken=e}_clearToken(){localStorage.removeItem(`smartchat_token_${this.apiKey}`),this.userToken=null}_getSessionId(){let e="smartchat_session_id",t=localStorage.getItem(e);return t||(t="sc_"+Math.random().toString(36).substring(2)+Date.now().toString(36),localStorage.setItem(e,t)),t}mount(){this.host=document.createElement("div"),this.host.id="smartchat-widget",this.shadow=this.host.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=In,this.shadow.appendChild(e),this.host.style.setProperty("--sc-primary",this.config.primary_color||"#4F46E5"),this._buildUI(),document.body.appendChild(this.host),this._connectWS()}_buildUI(){let e=document.createElement("button");e.className="sc-bubble",e.innerHTML=Js,e.addEventListener("click",()=>this._toggle()),this.shadow.appendChild(e),this.bubbleEl=e;let t=document.createElement("div");t.className="sc-window sc-hidden";let i=this.config.logo_url?`<img class="sc-logo" src="${this.config.logo_url}" alt="" />`:"";t.innerHTML=`
      <div class="sc-header">
        <div class="sc-header-left">
          ${i}
          <span>Chat</span>
        </div>
        <button class="sc-close">${ei}</button>
      </div>
      <div class="sc-login-form sc-hidden">
        <div class="sc-login-title">Sign in to continue</div>
        <input type="email" class="sc-login-email" placeholder="Email" />
        <input type="password" class="sc-login-password" placeholder="Password" />
        <div class="sc-login-error sc-hidden"></div>
        <button class="sc-login-btn">Sign In</button>
      </div>
      <div class="sc-chat-area">
        <div class="sc-messages"></div>
      </div>
    `;let n=document.createElement("div");n.className="sc-input-area",this.richEditor=new Ge({onSend:()=>this._sendMessage(),shadowRoot:this.shadow}),n.appendChild(this.richEditor.build()),this.sendBtn=document.createElement("button"),this.sendBtn.className="sc-send",this.sendBtn.textContent="Send",this.sendBtn.addEventListener("click",()=>this._sendMessage()),n.appendChild(this.sendBtn),t.querySelector(".sc-chat-area").appendChild(n),this.shadow.appendChild(t),this.windowEl=t,this.messagesEl=t.querySelector(".sc-messages"),this.loginFormEl=t.querySelector(".sc-login-form"),this.chatAreaEl=t.querySelector(".sc-chat-area"),t.querySelector(".sc-close").addEventListener("click",()=>this._toggle());let a=t.querySelector(".sc-login-btn"),l=t.querySelector(".sc-login-email"),p=t.querySelector(".sc-login-password");a.addEventListener("click",()=>this._handleLogin()),p.addEventListener("keypress",c=>{c.key==="Enter"&&this._handleLogin()}),this._checkAuthAndShowUI(),this.config.greeting&&this.isLoggedIn&&this._addMessage("assistant",this.config.greeting)}_checkAuthAndShowUI(){if(this.userContext.user_id||this.userToken){this.isLoggedIn=!0,this._showChat();return}this.authConfig&&this.authConfig.requires_login?this._showLogin():(this.isLoggedIn=!0,this._showChat())}_showLogin(){this.loginFormEl.classList.remove("sc-hidden"),this.chatAreaEl.classList.add("sc-hidden")}_showChat(){this.loginFormEl.classList.add("sc-hidden"),this.chatAreaEl.classList.remove("sc-hidden"),this.config.greeting&&this.messagesEl.children.length===0&&this._addMessage("assistant",this.config.greeting)}async _handleLogin(){let e=this.loginFormEl.querySelector(".sc-login-email"),t=this.loginFormEl.querySelector(".sc-login-password"),i=this.loginFormEl.querySelector(".sc-login-error"),n=this.loginFormEl.querySelector(".sc-login-btn"),o=e.value.trim(),a=t.value;if(!o||!a){i.textContent="Please enter email and password",i.classList.remove("sc-hidden");return}n.disabled=!0,n.textContent="Signing in...",i.classList.add("sc-hidden");try{let p=await(await fetch(`${this.serverUrl}/api/auth/login/${this.apiKey}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o,password:a})})).json();p.success?(this._saveToken(p.token),this.userContext.user_id=p.user_id,this.userContext.name=p.user_name,this.userContext.email=p.user_email,this.isLoggedIn=!0,this._showChat(),e.value="",t.value=""):(i.textContent=p.error||"Login failed",i.classList.remove("sc-hidden"))}catch{i.textContent="Connection error. Please try again.",i.classList.remove("sc-hidden")}finally{n.disabled=!1,n.textContent="Sign In"}}_toggle(){this.isOpen=!this.isOpen,this.isOpen?(this.windowEl.classList.remove("sc-hidden"),this.richEditor.focus()):this.windowEl.classList.add("sc-hidden")}_addMessage(e,t){let i=document.createElement("div");return i.className=`sc-message sc-message-${e}`,e==="assistant"&&t?i.innerHTML=Rt(t):i.textContent=t,this.messagesEl.appendChild(i),this.messagesEl.scrollTop=this.messagesEl.scrollHeight,i}_appendToLastMessage(e){let t=this.messagesEl.querySelectorAll(".sc-message-assistant");if(t.length>0){let i=t[t.length-1];i._rawMarkdown||(i._rawMarkdown=""),i._rawMarkdown+=e,i._renderPending||(i._renderPending=!0,requestAnimationFrame(()=>{i.innerHTML=Rt(i._rawMarkdown),i._renderPending=!1,this.messagesEl.scrollTop=this.messagesEl.scrollHeight}))}}_sendMessage(){if(this.richEditor.isEmpty()||this.isStreaming)return;let e=this.richEditor.getHTML(),t=Ln(e);if(!t.trim())return;this._addMessage("user",t),this.richEditor.clear(),this.isStreaming=!0,this.sendBtn.disabled=!0,this.richEditor.setEnabled(!1),this._addMessage("assistant",""),this.wsClient.send(t,this.apiKey,this.userToken)||(this._appendToLastMessage("Connection error. Please try again."),this.isStreaming=!1,this.sendBtn.disabled=!1,this.richEditor.setEnabled(!0))}_connectWS(){this.wsClient=new Oe(this.serverUrl,this.sessionId),this.wsClient.onChunk=e=>{this._appendToLastMessage(e)},this.wsClient.onDone=()=>{this.isStreaming=!1,this.sendBtn.disabled=!1,this.richEditor.setEnabled(!0)},this.wsClient.onError=e=>{this._appendToLastMessage(`
[Error: ${e}]`),this.isStreaming=!1,this.sendBtn.disabled=!1,this.richEditor.setEnabled(!0)},this.wsClient.connect()}};(function(){let s=document.currentScript;if(!s){console.error("SmartChat: Could not find script element");return}let e=s.getAttribute("data-api-key");if(!e){console.error("SmartChat: data-api-key attribute is required");return}let t={},i=s.getAttribute("data-user-id"),n=s.getAttribute("data-user-name"),o=s.getAttribute("data-user-email"),a=s.getAttribute("data-user-meta");if(i&&(t.user_id=i),n&&(t.name=n),o&&(t.email=o),a)try{t.meta=JSON.parse(a)}catch{console.warn("SmartChat: Invalid JSON in data-user-meta")}let l=s.src,p=l.substring(0,l.lastIndexOf("/"));Promise.all([fetch(`${p}/api/widget/config/${e}`).then(c=>{if(!c.ok)throw new Error("Failed to load widget config");return c.json()}),fetch(`${p}/api/auth/config/${e}`).then(c=>c.ok?c.json():{auth_mode:"none",requires_login:!1})]).then(([c,f])=>{let b=new qe(p,e,c,t,f);b.mount(),window.SmartChat={identify(g){g.userId&&(b.userContext.user_id=g.userId),g.name&&(b.userContext.name=g.name),g.email&&(b.userContext.email=g.email),g.meta&&(b.userContext.meta=g.meta),b.isLoggedIn=!0,b._showChat()},logout(){b._clearToken(),b.isLoggedIn=!1,b._showLogin()}}}).catch(c=>{console.error("SmartChat: Failed to initialize",c)})})();})();
/*! Bundled license information:

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.3.1 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.1/LICENSE *)
*/

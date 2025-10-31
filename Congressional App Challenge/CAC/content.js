(async () => {
    // Load your popover.html file
    const popoverURL = chrome.runtime.getURL("popover.html");
    const popoverResponse = await fetch(popoverURL);
    const html = await popoverResponse.text();

    // Create a wrapper div and inject it into the page
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    // Get the popover element from your HTML
    const popover = container.querySelector("#popover");
    popover.style.display = "none"; // hidden by default

    // Handle text selection

    const getDomain = (url) => {
        const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/);
        return match ? match[1] : url;
    };

    document.addEventListener("mouseup", async () => {
        const selection = window.getSelection();
        const text = selection.toString().trim();


        if (!text) {
            popover.style.display = "none";
            return;
        } else {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': YOUR_KEY_HERE
                },
                body: JSON.stringify({
                    model: "groq/compound",
                    messages: [
                        { role: 'system', content: `You are a fact-checking assistant. Given a statement, classify it as one of: "True", "False", "Unsure", "Unverified", or "Mixed" based solely on factual accuracy. Provide a concise 1-2 sentence rationale that supports the classification. 

You MUST respond with valid JSON only and NOTHING ELSE (no explanatory text, no markdown, no surrounding commentary).The JSON must conform exactly to the following JSON Schema:

{
  "type": "object",
  "properties": {
    "classification": {
      "type": "string",
      "enum": ["True", "False", "Unsure", "Mixed", "Unverified"]
    },
    "rationale": {
      "type": "string",
      "description": "A brief, 1-2 sentence explanation supporting the classification."
    }
  },
  "required": ["classification", "rationale"],
  "additionalProperties": false
}

Always use web search/tools to verify facts before responding. If evidence supports multiple distinct claims, return classification of "Mixed". If evidence is insufficient or inconclusive, return classification of "Unsure". 

Example response:
{"classification":"False","rationale":"[brief 1-2 sentence explanation based on verified facts]."}
` },
                        { role: 'user', content: `Fact-check the following statement: "${text}"` }
                    ],
                    stream: false,
                    response_format: {"type": "json_object"}
                })
            });
            // Parse HTTP response and model content
            console.log(response);
            const data = await response.json();
            const messageData = JSON.parse(data.choices[0].message.content);
            const classification = messageData.classification;
            const rationale = messageData.rationale;
            const searchData = data.choices[0].message.executed_tools[0].search_results;
            const citations = searchData.results
            citations.sort((a, b) => b.score - a.score);
            const citation1El = container.querySelector("#citation-1");
            const citation2El = container.querySelector("#citation-2");
            if (citation1El && citations[0]) citation1El.href = citations[0].url;
            if (citation2El && citations[1]) citation2El.href = citations[1].url;
            const domainSelector = new RegExp("^(?:https?:\/\/)?(?:www\.)?([^\/]+)");
            if (citation1El && citations[0]) citation1El.textContent = getDomain(citations[0].url);
            if (citation2El && citations[1]) citation2El.textContent = getDomain(citations[1].url);

            const emotionScore = await fetch('http://127.0.0.1:5001/analyze?text=' + encodeURIComponent(text));
            const emotionData = await emotionScore.json();
            const score = emotionData.score;
            if (score > 0.7) {
                const warnEl = container.querySelector(".emotion-warning") || document.querySelector(".emotion-warning");
                if (warnEl) {
                    warnEl.style.visibility = "visible";
                    warnEl.style.position = "static";
                }
            } else {
                const warnEl = container.querySelector(".emotion-warning") || document.querySelector(".emotion-warning");
                if (warnEl) {
                    warnEl.style.visibility = "hidden";
                    warnEl.style.position = "absolute";
                }
            }

            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

        // Position BELOW the highlighted text
        const top = rect.bottom + window.scrollY + 8; // 8px padding below text
        const left = rect.left + window.scrollX + rect.width / 2;

        popover.style.position = "absolute";
        popover.style.top = `${top}px`;
        popover.style.left = `${left}px`;
        popover.style.transform = "translate(-50%, 0)";
        popover.style.display = "block";
        popover.style.left = `${Math.min(left, window.innerWidth - 200)}px`;
        const classLabel = container.querySelector("#classification-label-truthFinder");
        const rationaleEl = container.querySelector("#rationale-truthFinder");
        if (classLabel) {
            classLabel.textContent = classification;
            classLabel.className = `label label-${classification}`;
        }
        if (rationaleEl) rationaleEl.textContent = rationale;

    }});

    // Close button hides the popover
    container.addEventListener("click", (e) => {
        if (e.target.classList.contains("close")) {
            popover.style.display = "none";
        }
    });
})();

/* ============================================================
   ITR INTEGRATED TECHNOLOGIES — CHATBOT
   Rule-based assistant with keyword matching.
   No API key required. Fully offline.
   ============================================================ */

(() => {
  'use strict';

  const bot = document.getElementById('chatbot');
  if (!bot) return;

  const launcher     = document.getElementById('chatbotLauncher');
  const panel        = document.getElementById('chatbotPanel');
  const closeBtn     = document.getElementById('chatbotClose');
  const messages     = document.getElementById('chatbotMessages');
  const suggestions  = document.getElementById('chatbotSuggestions');
  const form         = document.getElementById('chatbotForm');
  const input        = document.getElementById('chatbotInput');
  const badge        = document.getElementById('chatbotBadge');

  /* ---------- KNOWLEDGE BASE ---------- */
  /* Each entry: keywords to match, and a reply (HTML allowed). */
  const knowledgeBase = [
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'start'],
      reply: "Hello 👋 How can I help? You can ask about our capabilities, our location, or how to get in touch."
    },
    {
      keywords: ['service', 'services', 'offer', 'capabilities', 'solutions', 'what do you do', 'help with'],
      reply: "We cover six core capability areas:<br>• Digital transformation &amp; process automation<br>• Cloud, infrastructure &amp; managed services<br>• Security, eKYC &amp; financial crime mitigation<br>• Software development &amp; systems integration<br>• Talent-as-a-Service &amp; IT advisory<br>• Customer experience &amp; engagement<br><br>Want details on any of these? Just ask."
    },
    {
      keywords: ['location', 'located', 'address', 'office', 'where are you', 'where are you based', 'visit'],
      reply: "We're based in Lagos, Nigeria:<br><br><strong>9 Queens Court Estate, off 1 Layi Ajayi-Bembe Street, Parkview Estate, Ikoyi, Lagos.</strong><br><br>If you'd like to visit, please contact us in advance so we can arrange the right people to be available."
    },
    {
      keywords: ['contact', 'email', 'phone', 'call', 'reach', 'talk to'],
      reply: "You can reach us in three ways:<br>• Phone: <a href='tel:+2348023305565'>+234 802 330 5565</a><br>• Email: <a href='mailto:itrintegrated@gmail.com'>itrintegrated@gmail.com</a><br>• Contact form: <a href='contact.html'>contact.html</a>"
    },
    {
      keywords: ['hours', 'open', 'timing', 'available', 'when are you open', 'business hours'],
      reply: "Our business hours are <strong>Monday – Friday, 9:00 – 17:00 (WAT)</strong>. Weekend and public-holiday enquiries are answered the next business day."
    },
    {
      keywords: ['response', 'respond', 'how long', 'how quickly', 'reply'],
      reply: "We aim to respond within <strong>one business day</strong>. For urgent matters, calling <a href='tel:+2348023305565'>+234 802 330 5565</a> is the fastest way to reach us."
    },
    {
      keywords: ['bank', 'banks', 'banking', 'financial', 'finance', 'jaiz', 'financial services'],
      reply: "Yes — financial services is a core strength. We've worked with <strong>Jaiz Bank</strong> and have experience across banking, payments, asset management and pensions. Our focus areas include core banking, financial crime mitigation, eKYC and secure integration."
    },
    {
      keywords: ['automation', 'rpa', 'process', 'workflow', 'uipath', 'processmaker', 'n8n'],
      reply: "We help organisations automate workflows using <strong>ProcessMaker</strong>, <strong>UiPath (RPA)</strong>, <strong>n8n</strong> and AI-enabled approaches. Our focus is on reducing manual effort, improving consistency and helping teams focus on higher-value work."
    },
    {
      keywords: ['cloud', 'aws', 'azure', 'google cloud', 'infrastructure', 'hosting'],
      reply: "We work across AWS, Azure, Google Cloud, IBM Cloud, Oracle and others. We help clients evaluate options against their existing environment, governance and operational goals — then design the migration or modernisation path."
    },
    {
      keywords: ['security', 'secure', 'cyber', 'ekyc', 'kyc', 'aml', 'fraud', 'compliance'],
      reply: "Our security capabilities include sanctions screening, PEP matching, customer risk scoring, transaction monitoring, fraud mitigation, eKYC / KYB and multi-factor authentication — designed for regulated environments."
    },
    {
      keywords: ['software', 'app', 'application', 'development', 'web', 'mobile', 'build'],
      reply: "We build web and mobile applications, enterprise portals, API-connected tools and internal systems. We also handle systems integration, requirements documentation, testing and enterprise document management."
    },
    {
      keywords: ['talent', 'staff', 'recruit', 'hiring', 'augmentation', 'team', 'advisory', 'consult'],
      reply: "We offer <strong>Talent-as-a-Service</strong> — full-time and contract resources, staff augmentation, board advisory, IT consulting and project management support. Useful when you need senior capability quickly."
    },
    {
      keywords: ['leadership', 'ceo', 'founder', 'owner', 'olusina', 'ayegbusi', 'md'],
      reply: "ITR is led by <strong>Olusina Ayegbusi</strong>, Managing Director &amp; Lead Consultant — a senior IT and business executive with over 27 years of experience in banking and financial services, including a previous role as Group CIO at Guaranty Trust Holding Company."
    },
    {
      keywords: ['about', 'company', 'who are you', 'itr', 'background'],
      reply: "ITR Integrated Technologies is a technology solutions provider and systems integrator. Our portfolio spans consulting, digital transformation, security, cloud, mobility, infrastructure, project management, core banking, automation, AI, procurement and talent services."
    },
    {
      keywords: ['price', 'pricing', 'cost', 'budget', 'quote', 'rates'],
      reply: "Engagements are priced based on scope, complexity and duration. We'd be happy to discuss your requirements and provide a proposal — the best first step is a short conversation. Would you like the contact details?"
    },
    {
      keywords: ['career', 'job', 'vacancy', 'hiring', 'work for you', 'apply'],
      reply: "We're always interested in hearing from strong practitioners. Please send a short note and your CV to <a href='mailto:itrintegrated@gmail.com'>itrintegrated@gmail.com</a> — we review every message."
    },
    {
      keywords: ['thank', 'thanks', 'appreciate'],
      reply: "You're welcome. If there's anything else you'd like to know, just ask — or reach us directly at <a href='contact.html'>contact.html</a>."
    },
    {
      keywords: ['bye', 'goodbye', 'see you'],
      reply: "Thanks for stopping by. Reach us any time at <a href='mailto:itrintegrated@gmail.com'>itrintegrated@gmail.com</a> or through the contact form."
    }
  ];

  /* ---------- FALLBACK ---------- */
  const fallbackReply =
    "I'm not sure I have a good answer for that yet. " +
    "You can reach our team directly through the <a href='contact.html'>contact form</a> or at " +
    "<a href='mailto:itrintegrated@gmail.com'>itrintegrated@gmail.com</a> — they'll be happy to help.";

  /* ---------- MATCH ENGINE ---------- */
  function findAnswer(userText) {
    const text = userText.toLowerCase().trim();
    if (!text) return null;

    // Score each entry by how many keywords it contains
    let best = null;
    let bestScore = 0;

    for (const entry of knowledgeBase) {
      let score = 0;
      for (const kw of entry.keywords) {
        if (text.includes(kw)) {
          // Weight longer keywords higher (more specific)
          score += kw.length;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    }

    return best ? best.reply : fallbackReply;
  }

  /* ---------- UI HELPERS ---------- */
  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function addMessage(text, sender = 'bot') {
    const msg = document.createElement('div');
    msg.className = `chat-message ${sender}`;
    msg.innerHTML = `<div class="chat-bubble">${text}</div>`;
    messages.appendChild(msg);
    scrollToBottom();
  }

  function addTyping() {
    const el = document.createElement('div');
    el.className = 'chat-message bot chat-typing';
    el.innerHTML =
      '<div class="chat-bubble">' +
        '<span class="dot"></span><span class="dot"></span><span class="dot"></span>' +
      '</div>';
    messages.appendChild(el);
    scrollToBottom();
    return el;
  }

  function removeTyping(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function replyWithDelay(text) {
    const typing = addTyping();
    const delay = Math.min(1200, 400 + text.length * 8);
    setTimeout(() => {
      removeTyping(typing);
      addMessage(text, 'bot');
    }, delay);
  }

  /* ---------- OPEN / CLOSE ---------- */
  function openChat() {
    bot.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    if (badge) badge.style.display = 'none';
    setTimeout(() => input && input.focus(), 250);
  }

  function closeChat() {
    bot.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
  }

  launcher.addEventListener('click', () => {
    bot.classList.contains('is-open') ? closeChat() : openChat();
  });
  closeBtn.addEventListener('click', closeChat);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bot.classList.contains('is-open')) {
      closeChat();
    }
  });

  /* ---------- SUGGESTIONS ---------- */
  if (suggestions) {
    suggestions.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-question]');
      if (!btn) return;
      const q = btn.getAttribute('data-question');
      addMessage(q, 'user');
      replyWithDelay(findAnswer(q));
      // Hide suggestions after first use
      suggestions.style.display = 'none';
    });
  }

  /* ---------- FORM SUBMIT ---------- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    input.focus();

    // Hide suggestions once user types their own question
    if (suggestions) suggestions.style.display = 'none';

    replyWithDelay(findAnswer(text));
  });

  /* ---------- BADGE VISIBILITY ---------- */
  // Hide the "1" badge after first open (handled in openChat)

  /* ---------- SUBTLE AUTO-OPEN ON SCROLL ---------- */
  // Do NOT auto-open — respect the user. Badge is enough.

})();
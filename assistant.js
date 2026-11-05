/* Scripted stand-in for the application assistant.
   In production this is a model grounded only in approved documents. Here every answer is written by hand,
   cites the document it comes from, flags what to watch for, and ends with the next questions worth asking.
   Merge fields in [BRACKETS] come from the draft legal text and are not final. */
window.LA_ASSIST = (function () {
  var T = {
    why_ssn: { q: "Why do you need my Social Security number?", keys: ["social security", "ssn", "why do you need my"],
      a: "Two reasons. Federal law requires lenders to confirm who they are lending to, and we use it to look up your credit. For this step that is a soft check with Equifax, so your score stays the same.\n\nType it only in the secure field on the screen, never in this chat.",
      heads: "Locking in your rate later is a hard check, and we ask first.",
      src: [["Why we ask for your SSN", "ssn"], ["Credit authorization", "consentA"]], next: ["soft_hard", "equifax", "more_docs"] },
    soft_hard: { q: "Will checking my rate hurt my credit?", keys: ["hurt my credit", "credit score", "soft", "affect my score", "lower my score", "hard check", "hard pull", "soft pull"],
      a: "Checking your rate is a soft inquiry with Equifax. It does not affect your credit score.\n\nLocking in your rate later is a hard inquiry, and that may lower your score. We will ask you first, and we only run it if you say yes.",
      heads: "The soft check and the hard check are different steps. Only the second one can move your score.",
      src: [["Credit authorization", "consentA"], ["Hard check authorization", "hard"]], next: ["what_hard", "fixed", "how_set"] },
    what_hard: { q: "What is a hard inquiry?", keys: ["hard inquiry", "what is a hard", "inquiry"],
      a: "It is when a lender checks your credit to decide on a loan. It is recorded on your credit report and can lower your score a little. Several in a short time can add up, so it helps to know when one happens.\n\nOurs happens only when you lock in your rate.",
      src: [["Hard check authorization", "hard"]], next: ["soft_hard", "fed_vs_private"] },
    equifax: { q: "Who is Equifax, and what is Prism?", keys: ["equifax", "prism", "credit bureau", "who is"],
      a: "Equifax is one of the credit bureaus. It holds credit reports and gives us yours.\n\nPrism is a company Equifax works with. It turns your bank transactions into a cash flow score, which helps us look at your real income and bills and not only a credit score.",
      src: [["Credit authorization", "consentA"], ["Bank authorization", "consentB"]], next: ["bank_safe", "bank_why"] },
    bank_safe: { q: "Is it safe to connect my bank?", keys: ["safe", "secure", "connect my bank", "bank login", "password", "credentials", "my bank"],
      a: "You enter your bank login directly with [BANK_DATA_PROVIDER]. We never see or store it.\n\nWe cannot take money from your account through this connection, and we do not sell your data. You can disconnect any time.",
      heads: "If you disconnect before we decide, we may not be able to finish your application.",
      src: [["Bank authorization", "consentB"]], next: ["bank_why", "nobank_q", "who_data"] },
    bank_why: { q: "Why do you need my bank information?", keys: ["why do you need my bank", "bank information", "bank info", "why bank", "cash flow", "bank data"],
      a: "It lets us confirm your income and see your regular bills, so we can consider your application without relying only on a credit score.",
      src: [["Bank authorization", "consentB"]], next: ["bank_safe", "equifax"] },
    nobank_q: { q: "What if I cannot connect my bank?", keys: ["cannot connect", "can't connect", "dont have a bank", "no bank", "statements instead", "without my bank"],
      a: "You can send us recent bank statements instead, and we may ask for other documents too. It can take longer, and your progress stays saved.",
      src: [["If you cannot connect", "nobank"]], next: ["more_docs", "talk"] },
    more_docs: { q: "Why would you ask me for more documents?", keys: ["more documents", "additional documents", "extra documents", "more information", "why am i seeing", "pay stub", "proof of income", "photo id"],
      a: "If we cannot confirm your identity, income, employment or enrollment from what you gave us, we may ask for more. For example a photo ID, pay stubs or bank statements.\n\nYou agreed to this in the credit authorization.",
      heads: "If we do not get what we need, we may not be able to finish your application.",
      src: [["Why we ask for more", "whydocs"], ["Credit authorization", "consentA"]], next: ["talk", "bank_safe"] },
    who_data: { q: "Who gets my information?", keys: ["my information", "my data", "privacy", "share my", "who gets", "sell my"],
      a: "We share it to run everyday business, like processing your loan and reporting to credit bureaus, and for our own marketing. We do not share it with our affiliates or other companies so they can market to you.",
      heads: "[Draft assumption, pending the affiliate sharing decision.]",
      src: [["Privacy notice", "privacy"]], next: ["opt_marketing", "contact_q"] },
    esign_q: { q: "What am I agreeing to with electronic records?", keys: ["electronic", "e-sign", "esign", "paperless", "sign electronically"],
      a: "You are agreeing to get your loan documents electronically and to sign them electronically.\n\nYou can ask for paper copies any time for free, and you can take your consent back. You need a phone or computer, a current browser, a PDF reader and an email you check.",
      src: [["Electronic consent", "esign"]], next: ["paper_q", "who_data"] },
    paper_q: { q: "Can I apply on paper instead?", keys: ["paper", "mail it", "print"],
      a: "Yes, you have the right to. Contact us and we will send a paper application package at no charge. [Contact method supplied by operations.]",
      src: [["Apply on paper", "paper"]], next: ["esign_q"] },
    contact_q: { q: "Why do you want to call or text me?", keys: ["call me", "text me", "contact me", "calls", "texts", "robocall"],
      a: "To tell you about your application and loan, like status, due dates and payments. This is separate from marketing, which is optional. You can withdraw call and text consent any time.",
      src: [["Contact consent", "consentC1"]], next: ["opt_marketing"] },
    opt_marketing: { q: "Do I have to agree to marketing?", keys: ["marketing", "offers", "spam", "promotional"],
      a: "No. It is optional, it has no effect on your loan, and you can say no and still get everything else.",
      src: [["Marketing consent", "consentC2"]], next: ["contact_q"] },
    income_q: { q: "What counts as income?", keys: ["income", "what counts", "side job", "tips", "alimony", "child support"],
      a: "Pay from a job, tips, side work, and money you get regularly. A job offer that starts soon counts too. You do not have to include alimony, child support or separate maintenance unless you want us to consider it. A rough number is fine.",
      src: [["What counts as income", "income"]], next: ["more_docs", "how_set"] },
    school_share: { q: "Why does my school share information with you?", keys: ["my school", "school share", "enrollment", "ferpa"],
      a: "Before we send money, your school has to confirm you are enrolled and certify the loan amount. This lets your school share your enrollment and aid details with us, and lets us share what the school needs to certify the loan.",
      src: [["School verification", "consentD"]], next: ["how_much", "line_c"] },
    fixed: { q: "What does a fixed rate mean?", keys: ["fixed", "variable", "rate change", "go up"],
      a: "Your rate stays the same for the whole loan. It will not go up or down. Interest is calculated daily on what you still owe, starting when the loan is paid out.",
      src: [["Loan disclosure", "h18"]], next: ["how_set", "apr", "prepay"] },
    how_set: { q: "How is my rate set?", keys: ["how is my rate", "my rate set", "who decides", "how do you decide", "minimum credit score", "credit requirement"],
      a: "It is set after you apply, using your credit history and other factors in your disclosure. We look primarily at your verified income and cash flow, and we do not require a minimum credit score.",
      src: [["Loan disclosure", "h18"]], next: ["fixed", "cosigner_q"] },
    apr: { q: "What is the difference between the interest rate and the APR?", keys: ["apr", "annual percentage", "interest rate"],
      a: "The interest rate is the yearly cost of borrowing. The APR also counts certain fees and when the money is paid out, so it can be higher. Your monthly payment is based on the interest rate, not the APR.",
      src: [["Approval disclosure", "h19"]], next: ["fixed", "accept_q"] },
    prepay: { q: "Can I pay it off early?", keys: ["pay early", "pay it off", "prepay", "early payment", "extra payment", "penalty"],
      a: "Yes, with no penalty. Extra payments go to interest first and then to principal.",
      src: [["Loan disclosure", "h18"]], next: ["interest_how"] },
    interest_how: { q: "How does interest work?", keys: ["how does interest", "capitalize", "capitalization", "accrue", "compound"],
      a: "Interest is what you pay to borrow. On this loan it is simple interest that builds daily on the amount you still owe.\n\nIf you pay nothing while you are in school, unpaid interest can be added to your balance later. That is called capitalization, and it means you then pay interest on a bigger amount.",
      heads: "[Shown only if a deferral option is offered.]",
      src: [["Loan disclosure", "h18"]], next: ["prepay", "budget"] },
    fed_vs_private: { q: "Should I look at federal aid first?", keys: ["federal", "studentaid", "fafsa", "grants", "scholarship", "other options", "alternatives"],
      a: "It is a good question for your school's financial aid office. Federal loans and grants can come with protections and repayment options that private loans do not, and aid can reduce what you need to borrow. studentaid.gov is a good place to start.\n\nThen borrow here only what you still need.",
      heads: "A private loan can reduce your eligibility for free or lower-cost aid.",
      src: [["Check federal aid first", "federal"], ["Loan disclosure", "h18"]], next: ["how_much", "line_c"] },
    how_much: { q: "How much should I borrow?", keys: ["how much", "borrow less", "amount", "enough", "too much"],
      a: "I cannot choose an amount for you, but these questions help.\n\nWhat is left after grants, scholarships and savings? Could any part wait or be covered another way? What payment could you manage after you finish?\n\nYour school confirms the final amount, and you can borrow less than the estimate.",
      heads: "The final amount comes from your school, so it can differ from what you enter.",
      src: [["How we estimate", "amount"]], next: ["fed_vs_private", "budget"] },
    budget: { q: "How do I know what payment I can handle?", keys: ["afford", "payment i can", "budget", "monthly payment", "manage the payment"],
      a: "Start with what you would bring home each month after you finish. List rent, food, transport and other regular bills. What is left is what a payment has to fit inside.\n\nYour Approval Disclosure shows the real payment before you accept anything.",
      src: [["Approval disclosure", "h19"]], next: ["accept_q", "interest_how"] },
    cosigner_q: { q: "What is a cosigner, and do I need one?", keys: ["cosigner", "cosign", "co-sign", "co signer"],
      a: "A cosigner shares responsibility for the loan. They are fully responsible if you do not pay, and the loan shows on their credit.\n\nI cannot tell you if you will need one. We will know after your rate check, and nothing happens to them unless they agree.",
      src: [["What cosigning means", "cosign"], ["Loan disclosure", "h18"]], next: ["who_cosign", "cosign_do"] },
    who_cosign: { q: "Who should I ask to cosign?", keys: ["who should i ask", "who can cosign", "parent", "ask someone"],
      a: "Someone you trust who has steady income and could afford the payments if you could not. Be open about the amount and what it means for them. It is their choice, and they get their own notice before they agree.",
      src: [["What cosigning means", "cosign"]], next: ["cosign_do"] },
    cosign_do: { q: "What will my cosigner have to do?", keys: ["what will my cosigner", "cosigner do", "what do they do", "what happens to my cosigner"],
      a: "They get a text, give their own electronic consent, read a Notice to Cosigner, answer a few questions about themselves, and allow a credit check. It is all on their own phone and takes a few minutes.",
      src: [["Notice to cosigner", "cosignerNotice"]], next: ["cosigner_q", "who_cosign"] },
    notice_q: { q: "What does this notice mean?", keys: ["this notice", "guarantee", "what does it mean", "responsible"],
      a: "In plain words: if the borrower does not pay, you will have to, up to the full amount plus any late fees or collection costs. The lender can collect from you without first going after the borrower. If the loan defaults, it can become part of your credit record.\n\nBe sure you can afford that and that you want the responsibility. You can say no.",
      src: [["Notice to cosigner", "cosignerNotice"]], next: ["cosign_do", "why_ssn"] },
    line_c: { q: "What is line C on the school form?", keys: ["line c", "line a", "line b", "cost of attendance", "self-cert", "school form", "difference"],
      a: "Line A is your school's cost of attendance. Line B is other aid you expect, like grants and scholarships. Line C is A minus B.\n\nCheck lines A and B with your school's financial aid office.",
      heads: "If you borrow more than line C, you risk reducing your eligibility for free or lower-cost aid.",
      src: [["School form", "selfcert"]], next: ["fed_vs_private", "how_much"] },
    accept_q: { q: "What should I check before I accept?", keys: ["before i accept", "should i accept", "check before", "what to look for"],
      a: "Four things.\n\n1. The rate, and that it is fixed.\n2. The monthly payment and when payments start.\n3. The total of payments, which is the real cost over the life of the loan.\n4. Fees and late charges.\n\nIt also helps to compare against federal options.",
      src: [["Approval disclosure", "h19"]], next: ["apr", "accept_time", "what_after_accept"] },
    accept_time: { q: "How long do I have to accept?", keys: ["how long do i have", "deadline", "expire", "when do i have to"],
      a: "Until [ACCEPTANCE_DEADLINE]. Your rate and terms will not change during that time, except as the law allows.",
      src: [["Approval disclosure", "h19"]], next: ["accept_q"] },
    what_after_accept: { q: "What happens after I accept?", keys: ["after i accept", "what happens next", "what's next", "whats next", "after i sign"],
      a: "You sign your school form and your loan agreement. Then we send a Final Disclosure, and you have until midnight of the third business day after you get it to cancel without penalty.",
      heads: "No money is sent before that window closes.",
      src: [["Approval disclosure", "h19"], ["Final Disclosure", "h20"]], next: ["cancel_q", "budget"] },
    cancel_q: { q: "Can I still change my mind?", keys: ["change my mind", "cancel", "back out", "withdraw"],
      a: "Yes, for a short window. After your Final Disclosure arrives you can cancel without penalty until midnight of the third business day after you get it. [Wording to be confirmed by counsel.]",
      src: [["Final Disclosure", "h20"]], next: ["what_after_accept"] },
    approve_q: { q: "Will I be approved?", keys: ["will i be approved", "get approved", "chances", "approval odds", "will i qualify", "denied"],
      a: "I cannot predict that. I do not make credit decisions and I cannot see how an application will turn out. Your rate check shows what you qualify for, and it will not affect your credit score.",
      src: [["Credit authorization", "consentA"]], next: ["soft_hard", "talk"] },
    what_sign: { q: "What am I signing on this screen?", keys: ["what am i signing", "what am i signing here", "what is this form"],
      a: { _: "This screen is where you sign. The full document is one tap away, and I can explain any part of it.",
        esign: "This is your consent to get documents and sign them electronically. It is not your loan agreement.",
        sign: "This is the federal school self-certification form. It confirms your school's cost, the aid you expect, and the difference. Your school needs it before the loan can go through.",
        mpn: "This is your Master Promissory Note and Credit Agreement, the contract for your loan. After you sign, you get a Final Disclosure and a short window to cancel." },
      src: [["School form", "selfcert"], ["Loan agreement", "mpn"]], next: ["cancel_q", "line_c"] },
    save_link: { q: "Text me a link to finish on my phone", keys: ["text me a link", "send me a link", "finish on my phone", "continue on my phone", "save my progress", "come back later"],
      a: "I can text a link to PHONE so you can pick up on your phone. Your progress is already saved.\n\nI will only send it after you say yes.",
      src: [], next: ["talk"], action: { yes: "Send the text", no: "Not now", done: "Sent to PHONE. Nothing else changed on your application.", declined: "No problem. Nothing was sent.", needPhone: "Add your mobile number first, then I can send it." } },
    stop: { q: "Stop", keys: ["stop", "never mind", "nevermind", "cancel that", "forget it"],
      a: "Stopped. I have not sent anything or changed anything on your application.",
      src: [], next: [] },
    talk: { q: "Talk to a person", keys: ["person", "human", "agent", "representative", "call you", "someone real", "support"],
      a: "Of course. [Support channels and hours supplied by operations.] Your progress is saved, and I can pass along what we talked about so you do not have to repeat it.",
      src: [], next: [], handoff: true }
  };

  var S = {
    start: ["soft_hard", "fed_vs_private", "esign_q", "contact_q"],
    confirm: ["who_data", "save_link"],
    credit: ["why_ssn", "soft_hard", "equifax", "more_docs"],
    welcome: ["soft_hard", "fed_vs_private", "esign_q"],
    esign: ["esign_q", "paper_q", "who_data"],
    phone: ["contact_q", "who_data", "esign_q"],
    code: ["talk"],
    disclosure: ["fixed", "how_set", "fed_vs_private", "prepay"],
    name: ["who_data", "save_link"], dob: ["who_data", "save_link"], address: ["who_data", "save_link"],
    income: ["income_q", "cosigner_q", "how_set", "more_docs"],
    amount: ["how_much", "fed_vs_private", "school_share"],
    review: ["save_link", "talk"],
    ssn: ["why_ssn", "soft_hard", "equifax", "more_docs"],
    bank: ["bank_safe", "bank_why", "nobank_q", "equifax"],
    loading: ["talk"],
    offerA: ["fixed", "what_hard", "fed_vs_private", "budget"],
    offerB: ["cosigner_q", "who_cosign", "cosign_do"],
    offerC: ["more_docs", "nobank_q", "talk"],
    cosigner: ["who_cosign", "cosign_do"],
    lockin: ["what_hard", "soft_hard", "approve_q"],
    approved: ["accept_q", "apr", "accept_time", "budget"],
    sign: ["line_c", "how_much", "fed_vs_private"],
    mpn: ["what_sign", "cancel_q", "who_data"],
    tracker: ["what_after_accept", "cancel_q", "budget", "interest_how"],
    c_landing: ["esign_q", "cosign_do", "talk"],
    c_notice: ["notice_q", "cosign_do"],
    c_you: ["who_data", "talk"], c_home: ["income_q", "who_data"],
    c_ssn: ["why_ssn", "soft_hard", "notice_q"],
    c_done: ["talk"]
  };

  var TIPS = {
    start: ["soft_hard"], credit: ["soft_hard"], disclosure: ["fed_vs_private", "how_set"], amount: ["how_much", "fed_vs_private"], ssn: ["soft_hard"], bank: ["bank_safe", "nobank_q"],
    offerA: ["fed_vs_private", "budget"], offerB: ["who_cosign"], lockin: ["what_hard"], approved: ["accept_q", "apr"], sign: ["line_c"], mpn: ["cancel_q"],
    c_landing: ["cosign_do"], c_notice: ["notice_q"]
  };

  var LEARN = [["interest_how", "How interest works"], ["fed_vs_private", "Federal and private loans"], ["budget", "Planning for your first payment"]];
  var GROUPS = [
    ["Understand your loan", ["fixed", "apr", "interest_how", "prepay"]],
    ["Before you borrow", ["how_much", "fed_vs_private", "budget", "cosigner_q"]],
    ["Your data and your credit", ["soft_hard", "what_hard", "equifax", "who_data"]],
    ["After you sign", ["accept_q", "what_after_accept", "cancel_q", "line_c"]]
  ];

  function norm(s) { return (" " + String(s || "").toLowerCase().replace(/[^a-z0-9' ]+/g, " ") + " ").replace(/\s+/g, " "); }
  function pick(a, screen) { return typeof a === "string" ? a : (a[screen] || a._ || ""); }
  function chip(id) { return { id: id, q: T[id].q }; }
  function find(q) {
    var n = norm(q), best = null, bestScore = 0;
    Object.keys(T).forEach(function (id) {
      var sc = 0;
      if (norm(T[id].q).trim() === n.trim()) sc = 100;
      T[id].keys.forEach(function (k) { if (n.indexOf(" " + norm(k).trim() + " ") > -1 || n.indexOf(norm(k).trim()) > -1) sc += k.length; });
      if (sc > bestScore) { bestScore = sc; best = id; }
    });
    return bestScore >= 3 ? best : null;
  }
  function build(id, screen, ctx) {
    var t = T[id];
    var phone = (ctx && ctx.phone) || "";
    var text = pick(t.a, screen), action = null;
    if (t.action) {
      if (phone) { text = text.replace("PHONE", phone); action = { yes: t.action.yes, no: t.action.no, done: t.action.done.replace("PHONE", phone), declined: t.action.declined, state: "pending" }; }
      else { text = t.action.needPhone; }
    }
    return { id: id, text: text, heads: t.heads || "", src: t.src.map(function (s) { return { label: s[0], sheet: s[1] }; }), next: t.next.map(chip), handoff: !!t.handoff, action: action };
  }
  function answer(input, screen, id, ctx) {
    if (!id && /\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/.test(input)) {
      return { id: "pii", text: "Please do not type your Social Security number or any bank login in this chat. Use the secure field on the screen instead. I can explain why we ask for it if that helps.", heads: "", src: [], next: [chip("why_ssn"), chip("bank_safe")], handoff: false, action: null };
    }
    var f = id || find(input);
    if (f) return build(f, screen, ctx);
    return { id: "unknown", text: "I do not have a good answer to that from your loan documents, and I do not want to guess. You can read the section I would start with, or talk to a person.", heads: "", src: [{ label: "Loan disclosure", sheet: "h18" }], next: [chip("talk"), chip("fed_vs_private"), chip("accept_q")], handoff: false, action: null };
  }

  var WELCOME = "Hi, I'm Guide, the LoanAmerica assistant. I'm an AI. I can explain anything on this screen and show you what is worth asking. I can't make credit decisions or change your application, and I can make mistakes, so check the documents I point to.";

  /* One controller per artboard. comp is the component, opt names the state key that opens the chat. */
  function controller(comp, opt) {
    var C = {
      st: function () { return comp.state; },
      welcome: function (sk) { return { role: "bot", welcome: true, screen: sk || opt.screenKey(), text: WELCOME, heads: "", src: [], next: [], handoff: false, action: null }; },
      initial: function () { return [C.welcome("welcome")]; },
      scroll: function () { comp.later(function () { var el = document.getElementById(opt.chatId); if (el) el.scrollTop = el.scrollHeight; }, 60); },
      open: function () {
        var o = { tab: "chat" }; o[opt.openKey] = true;
        if (!C.st().msgs.length) o.msgs = C.initial();
        comp.setState(o); C.scroll();
      },
      ask: function (q, id) {
        var sk = opt.screenKey();
        var msgs = C.st().msgs.slice();
        if (!msgs.length) msgs.push(C.welcome());
        msgs.push({ role: "user", text: q });
        var o = { msgs: msgs, typing: true, draft: "", tab: "chat" }; o[opt.openKey] = true;
        comp.setState(o); C.scroll();
        var res = answer(q, sk, id, { phone: opt.phone ? opt.phone() : "" });
        comp.later(function () {
          var m2 = C.st().msgs.slice();
          m2.push({ role: "bot", screen: sk, text: res.text, heads: res.heads, src: res.src, next: res.next, handoff: res.handoff, action: res.action, fb: null });
          comp.setState({ msgs: m2, typing: false }); C.scroll();
        }, 650);
      },
      pick: function (idx, c) {
        var m = C.st().msgs.slice(); m[idx] = Object.assign({}, m[idx], { picked: c.q });
        comp.setState({ msgs: m }); C.ask(c.q, c.id);
      },
      act: function (idx, ok) {
        var m = C.st().msgs.slice(); var cur = m[idx]; if (!cur || !cur.action) return;
        m[idx] = Object.assign({}, cur, { action: Object.assign({}, cur.action, { state: ok ? "done" : "declined" }) });
        m.push({ role: "bot", screen: opt.screenKey(), text: ok ? cur.action.done : cur.action.declined, heads: "", src: [], next: [], handoff: false, action: null, plain: true });
        comp.setState({ msgs: m }); C.scroll();
      },
      feedback: function (idx, v) {
        var m = C.st().msgs.slice(); m[idx] = Object.assign({}, m[idx], { fb: v });
        comp.setState({ msgs: m });
      },
      mic: function () {
        if (C.st().listening) return;
        comp.setState({ listening: true });
        comp.later(function () { comp.setState({ listening: false, draft: "How much should I borrow?" }); }, 1300);
      },
      send: function (e) { if (e && e.preventDefault) e.preventDefault(); var q = C.st().draft.trim(); if (q) C.ask(q); },
      view: function () {
        var s = C.st(), sk = opt.screenKey();
        var lastBotIdx = -1, lastUserIdx = -1;
        s.msgs.forEach(function (m, i) { if (m.role === "bot") lastBotIdx = i; if (m.role === "user") lastUserIdx = i; });
        var chatMsgs = s.msgs.map(function (m, i) {
          var active = m.role === "bot" && i === lastBotIdx && lastUserIdx < i && !s.typing && !m.picked;
          var choices = (m.role === "bot" && !m.welcome && m.next ? m.next : []).map(function (c) {
            var isPicked = m.picked === c.q;
            return { q: c.q, picked: isPicked, faded: !active && !isPicked, ask: function () { if (active) C.pick(i, c); },
              cls: isPicked ? "pickd" : (active ? "live" : "gone") };
          });
          var act = m.action || null;
          return {
            isUser: m.role === "user", isBot: m.role === "bot", text: m.text, plain: !!m.plain,
            hasHeads: !!m.heads, heads: m.heads || "",
            hasSrc: !!(m.src && m.src.length), srcs: (m.src || []).map(function (x) { return { label: x.label, open: function () { comp.setState({ sheet: x.sheet }); } }; }),
            handoff: !!m.handoff,
            hasChoices: choices.length > 0, choices: choices,
            hasAction: !!act, actionPending: !!act && act.state === "pending", actionYes: act ? act.yes : "", actionNo: act ? act.no : "",
            actionYesGo: function () { C.act(i, true); }, actionNoGo: function () { C.act(i, false); },
            showFb: m.role === "bot" && !m.welcome && !m.plain && i === lastBotIdx && !s.typing && m.id !== "stop",
            fbNone: !m.fb, fbUp: m.fb === "up", fbDown: m.fb === "down",
            fbYes: function () { C.feedback(i, "up"); }, fbNo: function () { C.feedback(i, "down"); }
          };
        });
        var last = s.msgs.length ? s.msgs[s.msgs.length - 1] : null;
        var showChips = !last || last.welcome || (last.role === "bot" && (!last.next || !last.next.length) && !last.plain) || last.plain;
        var chips = chip && (S[sk] || ["talk"]).map(function (id) { var c = chip(id); return { q: c.q, ask: function () { C.ask(c.q, c.id); } }; });
        var learnGroups = GROUPS.map(function (g) { return { title: g[0], items: g[1].map(function (id) { var c = chip(id); return { q: c.q, ask: function () { C.ask(c.q, c.id); } }; }) }; });
        return {
          chatMsgs: chatMsgs, chips: chips, showChips: showChips, chipsLabel: "Worth asking on this screen",
          learnGroups: learnGroups, tabChat: (s.tab || "chat") === "chat", tabLearn: s.tab === "learn",
          tabChatCls: (s.tab || "chat") === "chat" ? "sel" : "", tabLearnCls: s.tab === "learn" ? "sel" : "",
          goChat: function () { comp.setState({ tab: "chat" }); C.scroll(); }, goLearn: function () { comp.setState({ tab: "learn" }); },
          listening: !!s.listening, inputPlaceholder: s.listening ? "Listening..." : "Ask your own question",
          mic: function () { C.mic(); }, send: function (e) { C.send(e); }, onDraft: function (e) { comp.setState({ draft: e.target.value }); }
        };
      }
    };
    return C;
  }

  return {
    persona: { name: "Guide" },
    topic: function (id) { return T[id]; },
    suggest: function (screen) { return (S[screen] || ["talk"]).map(chip); },
    tips: function (screen) { return (TIPS[screen] || []).map(chip); },
    learn: function () { return LEARN.map(function (l) { return { id: l[0], q: l[1] }; }); },
    answer: answer,
    controller: controller
  };
})();

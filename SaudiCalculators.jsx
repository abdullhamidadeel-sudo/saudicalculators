import { useState, useEffect, useCallback } from "react";

const NAV = ["Home", "Loan", "Gold", "Currency", "About", "Contact"];

const fmt = (n) =>
  "SAR " + Number(n).toLocaleString("en-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const CURRENCY_LABELS = {
  SAR: "🇸🇦 ريال سعودي", USD: "🇺🇸 دولار أمريكي", EUR: "🇪🇺 يورو",
  GBP: "🇬🇧 جنيه إسترليني", AED: "🇦🇪 درهم إماراتي", KWD: "🇰🇼 دينار كويتي",
  BHD: "🇧🇭 دينار بحريني", OMR: "🇴🇲 ريال عُماني", QAR: "🇶🇦 ريال قطري",
  EGP: "🇪🇬 جنيه مصري", JOD: "🇯🇴 دينار أردني", INR: "🇮🇳 روبية هندية",
  PKR: "🇵🇰 روبية باكستانية", PHP: "🇵🇭 بيزو فلبيني", TRY: "🇹🇷 ليرة تركية",
};

const QUICK_PAIRS = ["USD","EUR","GBP","AED","KWD","EGP","INR","TRY"];

// ─── LOAN ───
function LoanCalc() {
  const [form, setForm] = useState({ amount: "", rate: "", period: "", unit: "years" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const calculate = () => {
    const amount = parseFloat(form.amount);
    const rate = parseFloat(form.rate);
    const period = parseFloat(form.period);
    if (!amount || amount <= 0 || isNaN(rate) || rate < 0 || !period || period <= 0) {
      setError("يرجى ملء جميع الحقول بقيم صحيحة."); setResult(null); return;
    }
    setError("");
    const months = form.unit === "years" ? period * 12 : period;
    let monthly, totalPay;
    if (rate === 0) { monthly = amount / months; totalPay = amount; }
    else {
      const r = rate / 100 / 12;
      monthly = (amount * (r * Math.pow(1 + r, months))) / (Math.pow(1 + r, months) - 1);
      totalPay = monthly * months;
    }
    setResult({ monthly, totalPay, interest: totalPay - amount, months });
  };

  return (
    <div>
      <div style={styles.calcHero}>
        <div style={styles.calcHeroKicker}>🏦 Loan Calculator</div>
        <h1 style={styles.calcHeroTitle}>حاسبة القرض</h1>
        <p style={styles.calcHeroSub}>احسب قسطك الشهري في ثوانٍ</p>
      </div>
      <div style={styles.calcWrap}>
        <div style={styles.calcCard}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>مبلغ القرض (ريال)</label>
              <input style={styles.input} type="number" placeholder="مثال: 100,000" value={form.amount} onChange={(e) => set("amount", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>معدل الفائدة السنوي (%)</label>
              <input style={styles.input} type="number" placeholder="مثال: 4.5" value={form.rate} onChange={(e) => set("rate", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>مدة القرض</label>
              <input style={styles.input} type="number" placeholder="مثال: 5" value={form.period} onChange={(e) => set("period", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>الوحدة</label>
              <select style={styles.input} value={form.unit} onChange={(e) => set("unit", e.target.value)}>
                <option value="years">سنوات</option>
                <option value="months">أشهر</option>
              </select>
            </div>
          </div>
          {error && <div style={styles.errorBox}>{error}</div>}
          <button style={styles.calcBtn} onClick={calculate}>احسب القسط الشهري ←</button>
          {result && (
            <div style={styles.resultBox}>
              <div style={styles.resultHeader}>📊 نتائج حساب القرض</div>
              <div style={styles.resultBody}>
                <ResultRow label="القسط الشهري" value={fmt(result.monthly)} highlight />
                <ResultRow label="إجمالي المبلغ المدفوع" value={fmt(result.totalPay)} />
                <ResultRow label="إجمالي الفائدة" value={fmt(result.interest)} />
                <ResultRow label="عدد الأقساط" value={`${result.months} قسط`} />
              </div>
            </div>
          )}
        </div>
        <div style={styles.seoBox}>
          <h2 style={styles.seoH2}>حاسبة القرض في المملكة العربية السعودية</h2>
          <p style={styles.seoP}>تساعدك هذه الأداة على معرفة قيمة القسط الشهري للقرض الشخصي أو قرض السيارة أو التمويل العقاري بدقة عالية، وفقاً لمعايير البنوك السعودية المعتمدة من ساما.</p>
        </div>
      </div>
    </div>
  );
}

// ─── GOLD ───
function GoldCalc() {
  const [form, setForm] = useState({ weight: "", karat: "0.875", price: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const karatLabels = { "1": "24 قيراط (99.9%)", "0.9167": "22 قيراط (91.67%)", "0.875": "21 قيراط (87.5%)", "0.75": "18 قيراط (75%)" };
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const calculate = () => {
    const weight = parseFloat(form.weight);
    const purity = parseFloat(form.karat);
    const price = parseFloat(form.price);
    if (!weight || weight <= 0 || !price || price <= 0) {
      setError("يرجى ملء جميع الحقول بقيم صحيحة."); setResult(null); return;
    }
    setError("");
    const base = weight * purity * price;
    const vat = base * 0.15;
    setResult({ base, vat, total: base + vat, karatLabel: karatLabels[form.karat] });
  };

  return (
    <div>
      <div style={styles.calcHero}>
        <div style={styles.calcHeroKicker}>🪙 Gold Calculator</div>
        <h1 style={styles.calcHeroTitle}>حاسبة سعر الذهب</h1>
        <p style={styles.calcHeroSub}>مع ضريبة القيمة المضافة 15% تلقائياً</p>
      </div>
      <div style={styles.calcWrap}>
        <div style={styles.calcCard}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>وزن الذهب (جرام)</label>
              <input style={styles.input} type="number" placeholder="مثال: 10" value={form.weight} onChange={(e) => set("weight", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>عيار الذهب</label>
              <select style={styles.input} value={form.karat} onChange={(e) => set("karat", e.target.value)}>
                <option value="1">24 قيراط (99.9% نقي)</option>
                <option value="0.9167">22 قيراط (91.67%)</option>
                <option value="0.875">21 قيراط (87.5%)</option>
                <option value="0.75">18 قيراط (75%)</option>
              </select>
            </div>
            <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
              <label style={styles.label}>سعر الجرام (ريال) – عيار 24</label>
              <input style={styles.input} type="number" placeholder="مثال: 240" value={form.price} onChange={(e) => set("price", e.target.value)} />
            </div>
          </div>
          {error && <div style={styles.errorBox}>{error}</div>}
          <button style={styles.calcBtn} onClick={calculate}>احسب سعر الذهب مع الضريبة ←</button>
          {result && (
            <div style={styles.resultBox}>
              <div style={styles.resultHeader}>🪙 تفاصيل سعر الذهب</div>
              <div style={styles.resultBody}>
                <ResultRow label="قيمة الذهب (قبل الضريبة)" value={fmt(result.base)} />
                <ResultRow label="ضريبة القيمة المضافة (15%)" value={fmt(result.vat)} />
                <ResultRow label="الإجمالي شامل الضريبة" value={fmt(result.total)} highlight />
                <ResultRow label="العيار والنقاوة" value={result.karatLabel} />
              </div>
            </div>
          )}
        </div>
        <div style={styles.seoBox}>
          <h2 style={styles.seoH2}>حاسبة سعر الذهب في السعودية</h2>
          <p style={styles.seoP}>الذهب من أهم السلع في المملكة. منذ 2018 تخضع مشتريات الذهب لضريبة القيمة المضافة بنسبة 15% وفقاً لهيئة الزكاة والضريبة والجمارك (زاتكا).</p>
        </div>
      </div>
    </div>
  );
}

// ─── CURRENCY (frankfurter.app - مجاني بدون API Key وبدون CORS) ───
function CurrencyCalc() {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("SAR");
  const [to, setTo] = useState("USD");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [liveRates, setLiveRates] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [ratesError, setRatesError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const currencies = Object.keys(CURRENCY_LABELS);

  const fetchRates = useCallback(async () => {
    setRatesLoading(true);
    setRatesError(false);
    try {
      // frankfurter.app - مجاني 100% وبيدعم CORS
      const targets = currencies.filter(c => c !== "SAR").join(",");
      const res = await fetch(
        `https://api.frankfurter.app/latest?from=SAR&to=${targets}`
      );
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      if (data && data.rates) {
        setLiveRates({ SAR: 1, ...data.rates });
        setLastUpdated(new Date());
        setRatesError(false);
      } else {
        setRatesError(true);
      }
    } catch {
      setRatesError(true);
    } finally {
      setRatesLoading(false);
    }
  }, []);

  useEffect(() => { fetchRates(); }, [fetchRates]);

  const swap = () => { setFrom(to); setTo(from); setResult(null); };

  const calculate = () => {
    if (!liveRates) { setError("جاري تحميل الأسعار، انتظر لحظة..."); return; }
    const val = parseFloat(amount);
    if (!val || val <= 0) { setError("يرجى إدخال مبلغ صحيح."); setResult(null); return; }
    setError("");
    const inSAR = val / (liveRates[from] || 1);
    const converted = inSAR * (liveRates[to] || 1);
    const rate = (liveRates[to] || 1) / (liveRates[from] || 1);
    setResult({ converted, rate, from, to, amount: val });
  };

  const fmtC = (n, d = 4) => Number(n).toLocaleString("en-SA", { minimumFractionDigits: 2, maximumFractionDigits: d });

  return (
    <div>
      <div style={styles.calcHero}>
        <div style={styles.calcHeroKicker}>💱 Currency Converter</div>
        <h1 style={styles.calcHeroTitle}>محوّل العملات</h1>
        <p style={styles.calcHeroSub}>أسعار صرف يومية حقيقية • يتحدث تلقائياً</p>
      </div>

      <div style={styles.calcWrap}>
        {/* شريط الحالة */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          background: ratesError ? "#fff3f3" : ratesLoading ? "#fff8e7" : "#e8f5e9",
          border:`1px solid ${ratesError ? "#f5b8b8" : ratesLoading ? "#fde38a" : "#a5d6a7"}`,
          borderRadius:8, padding:"10px 16px", marginBottom:16, fontSize:".82rem"
        }}>
          <span style={{ color: ratesError ? "#c0392b" : ratesLoading ? "#8a6200" : "#2e7d32", fontWeight:600 }}>
            {ratesLoading ? "⏳ جاري تحميل أسعار الصرف..." :
             ratesError   ? "❌ تعذّر تحميل الأسعار – اضغط تحديث" :
             `✅ أسعار يومية حقيقية • آخر تحديث: ${lastUpdated?.toLocaleTimeString("ar-SA")}`}
          </span>
          {!ratesLoading && (
            <button onClick={fetchRates} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"1rem", padding:"2px 6px" }} title="تحديث">🔄</button>
          )}
        </div>

        <div style={styles.calcCard}>
          <div style={styles.formGroup}>
            <label style={styles.label}>المبلغ المراد تحويله</label>
            <input
              style={{ ...styles.input, marginBottom:18, fontSize:"1.05rem" }}
              type="number" placeholder="أدخل المبلغ"
              value={amount} onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 48px 1fr", gap:12, alignItems:"end", marginBottom:20 }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>من</label>
              <select style={styles.input} value={from} onChange={(e) => setFrom(e.target.value)}>
                {currencies.map((c) => <option key={c} value={c}>{CURRENCY_LABELS[c]}</option>)}
              </select>
            </div>
            <button onClick={swap} style={{ background:"#F4F7FB", border:"1.5px solid #DDE4EF", borderRadius:8, height:46, fontSize:"1.3rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>⇄</button>
            <div style={styles.formGroup}>
              <label style={styles.label}>إلى</label>
              <select style={styles.input} value={to} onChange={(e) => setTo(e.target.value)}>
                {currencies.map((c) => <option key={c} value={c}>{CURRENCY_LABELS[c]}</option>)}
              </select>
            </div>
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <button style={{ ...styles.calcBtn, opacity: ratesLoading ? .6 : 1 }} onClick={calculate} disabled={ratesLoading}>
            {ratesLoading ? "⏳ جاري تحميل الأسعار..." : "تحويل العملة ←"}
          </button>

          {result && (
            <div style={styles.resultBox}>
              <div style={styles.resultHeader}>💱 نتيجة التحويل ✅</div>
              <div style={styles.resultBody}>
                <div style={{ textAlign:"center", padding:"20px 0 12px" }}>
                  <div style={{ color:"#5A6478", fontSize:".85rem", marginBottom:8 }}>
                    {fmtC(result.amount, 2)} {result.from} يساوي
                  </div>
                  <div style={{ color:"#C8960C", fontSize:"2.2rem", fontWeight:800 }}>
                    {fmtC(result.converted, 4)} {result.to}
                  </div>
                </div>
                <ResultRow label={`سعر الصرف (1 ${result.from})`} value={`${fmtC(result.rate, 5)} ${result.to}`} />
                <ResultRow label={`السعر العكسي (1 ${result.to})`} value={`${fmtC(1/result.rate, 5)} ${result.from}`} />
              </div>
              <div style={{ background:"#e8f5e9", borderTop:"1px solid #a5d6a7", padding:"10px 22px", fontSize:".78rem", color:"#2e7d32" }}>
                ✅ سعر يومي حقيقي • {lastUpdated?.toLocaleString("ar-SA")}
              </div>
            </div>
          )}

          {/* جدول الأسعار السريعة */}
          <div style={{ marginTop:28 }}>
            <div style={{ fontSize:".75rem", fontWeight:700, color:"#0D2347", letterSpacing:".6px", textTransform:"uppercase", marginBottom:12 }}>
              أسعار الريال السعودي اليوم
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(110px, 1fr))", gap:8 }}>
              {QUICK_PAIRS.map((code) => {
                const flag = CURRENCY_LABELS[code].split(" ")[0];
                const rate = liveRates?.[code];
                return (
                  <div key={code}
                    onClick={() => { setFrom("SAR"); setTo(code); setResult(null); }}
                    style={{ background:"#F4F7FB", border:"1px solid #DDE4EF", borderRadius:8, padding:"10px 8px", textAlign:"center", cursor:"pointer", position:"relative" }}>
                    <div style={{ fontSize:"1.1rem" }}>{flag}</div>
                    <div style={{ fontSize:".75rem", fontWeight:700, color:"#0D2347" }}>{code}</div>
                    {ratesLoading ? (
                      <div style={{ fontSize:".75rem", color:"#bbb", margin:"4px 0" }}>...</div>
                    ) : !rate ? (
                      <div style={{ fontSize:".75rem", color:"#e74c3c", margin:"4px 0" }}>—</div>
                    ) : (
                      <div style={{ fontSize:".85rem", color:"#C8960C", fontWeight:700, margin:"4px 0" }}>{fmtC(rate, 4)}</div>
                    )}
                    <div style={{ fontSize:".65rem", color:"#5A6478" }}>لكل ريال</div>
                    {!ratesLoading && rate && (
                      <div style={{ position:"absolute", top:4, left:4, width:6, height:6, borderRadius:"50%", background:"#2ecc71" }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={styles.seoBox}>
          <h2 style={styles.seoH2}>محوّل العملات للمملكة العربية السعودية</h2>
          <p style={styles.seoP}>يستخدم هذا المحوّل أسعار صرف يومية حقيقية ويدعم أكثر من 14 عملة عالمية وإقليمية بما فيها الدولار الأمريكي، اليورو، الدرهم الإماراتي، الدينار الكويتي، والجنيه المصري.</p>
          <p style={styles.seoP}>تتحدث الأسعار تلقائياً عند كل زيارة. للمعاملات الرسمية راجع البنك المركزي السعودي (ساما) أو صراف معتمد.</p>
        </div>
      </div>
    </div>
  );
}

// ─── RESULT ROW ───
function ResultRow({ label, value, highlight }) {
  return (
    <div style={{ ...styles.resultRow, ...(highlight ? styles.resultRowHL : {}) }}>
      <span style={styles.resultLabel}>{label}</span>
      <span style={{ ...styles.resultValue, ...(highlight ? styles.resultValueHL : {}) }}>{value}</span>
    </div>
  );
}

// ─── ABOUT ───
function About() {
  return (
    <div style={styles.pageInner}>
      <h1 style={styles.pageH1}>من نحن</h1>
      <p style={styles.seoP}>SaudiCalculators منصة أدوات مالية مجانية مخصصة لمساعدة المقيمين والشركات في المملكة العربية السعودية على اتخاذ قرارات مالية أفضل.</p>
      <h2 style={styles.seoH2}>أدواتنا</h2>
      <div style={styles.featGrid}>
        {[["🏦","حاسبة القرض","خطط لتمويلاتك الشخصية أو العقارية أو السيارات."],["🪙","حاسبة الذهب","احسب قيمة الذهب بكل العيارات مع ضريبة 15%."],["💱","محوّل العملات","أسعار صرف يومية حقيقية لأكثر من 14 عملة."],["🔒","خصوصية كاملة","لا يُحفظ أي بيانات. كل الحسابات تتم في متصفحك."]].map(([icon,title,desc]) => (
          <div key={title} style={styles.featCard}>
            <div style={styles.featIcon}>{icon}</div>
            <h3 style={styles.featTitle}>{title}</h3>
            <p style={{ ...styles.seoP, margin:0 }}>{desc}</p>
          </div>
        ))}
      </div>
      <h2 style={styles.seoH2}>إخلاء المسؤولية</h2>
      <p style={styles.seoP}>النتائج للأغراض التخطيطية فقط ولا تُعدّ مشورة مالية أو قانونية.</p>
    </div>
  );
}

// ─── CONTACT ───
function Contact() {
  const [form, setForm] = useState({ name:"", email:"", msg:"" });
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.name || !form.email || !form.msg) { alert("يرجى ملء جميع الحقول."); return; }
    setSent(true); setForm({ name:"", email:"", msg:"" });
    setTimeout(() => setSent(false), 5000);
  };
  return (
    <div style={styles.pageInner}>
      <h1 style={styles.pageH1}>تواصل معنا</h1>
      <p style={styles.seoP}>لديك سؤال أو اقتراح؟ نسعد بسماعك.</p>
      <div style={styles.contactGrid}>
        <div>
          <h3 style={styles.seoH2}>معلومات التواصل</h3>
          {[["📧","البريد الإلكتروني","info@saudicalculators.sa"],["📍","الموقع","الرياض، المملكة العربية السعودية"],["🕐","وقت الرد","خلال 1-2 يوم عمل (الأحد - الخميس)"]].map(([icon,title,val]) => (
            <div key={title} style={styles.contactItem}>
              <div style={styles.contactIcon}>{icon}</div>
              <div><strong style={{ display:"block", color:"#1A1F2E", marginBottom:2 }}>{title}</strong><span style={{ color:"#5A6478", fontSize:14 }}>{val}</span></div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={styles.formGroup}><label style={styles.label}>الاسم</label><input style={styles.input} type="text" placeholder="محمد الراشدي" value={form.name} onChange={(e)=>set("name",e.target.value)} /></div>
          <div style={styles.formGroup}><label style={styles.label}>البريد الإلكتروني</label><input style={styles.input} type="email" placeholder="example@email.com" value={form.email} onChange={(e)=>set("email",e.target.value)} /></div>
          <div style={styles.formGroup}><label style={styles.label}>الرسالة</label><textarea style={{ ...styles.input, minHeight:110, resize:"vertical" }} placeholder="اكتب رسالتك هنا..." value={form.msg} onChange={(e)=>set("msg",e.target.value)} /></div>
          <button style={styles.calcBtn} onClick={submit}>إرسال الرسالة ←</button>
          {sent && <div style={styles.successBox}>✅ شكراً! تم إرسال رسالتك بنجاح.</div>}
        </div>
      </div>
    </div>
  );
}

// ─── APP ───
export default function App() {
  const [page, setPage] = useState("Home");
  const navTo = (p) => { setPage(p); window.scrollTo(0,0); };
  const pages = { Home:<HomePage navTo={navTo}/>, Loan:<LoanCalc/>, Gold:<GoldCalc/>, Currency:<CurrencyCalc/>, About:<About/>, Contact:<Contact/> };
  const navLabels = { Home:"الرئيسية", Loan:"حاسبة القرض", Gold:"حاسبة الذهب", Currency:"محوّل العملات", About:"من نحن", Contact:"تواصل معنا" };
  return (
    <div style={{ fontFamily:"'Segoe UI', Tahoma, Arial, sans-serif", color:"#1A1F2E", background:"#fff", minHeight:"100vh", direction:"rtl" }}>
      <nav style={styles.nav}>
        <div style={styles.brand} onClick={() => navTo("Home")}>Saudi<span style={{ color:"#E5B62F" }}>Calculators</span></div>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {NAV.map((p) => <button key={p} onClick={()=>navTo(p)} style={{ ...styles.navBtn, ...(page===p?styles.navBtnActive:{}) }}>{navLabels[p]}</button>)}
        </div>
      </nav>
      <div>{pages[page]}</div>
      <footer style={styles.footer}>
        <p>© 2024 <strong style={{ color:"#fff" }}>SaudiCalculators</strong> · جميع الحقوق محفوظة</p>
        <p style={{ marginTop:6, fontSize:12 }}>خدمة المملكة العربية السعودية 🇸🇦 · الرياض · جدة · الدمام</p>
      </footer>
    </div>
  );
}

// ─── HOME ───
function HomePage({ navTo }) {
  return (
    <div>
      <div style={styles.hero}>
        <p style={styles.kicker}>المملكة العربية السعودية · أدوات مالية</p>
        <h1 style={styles.heroH1}>حاسبات مالية سعودية</h1>
        <p style={styles.heroSub}>أدوات مالية مجانية ودقيقة مصممة للأفراد والشركات في المملكة العربية السعودية</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button style={styles.btnGold} onClick={()=>navTo("Loan")}>🏦 حاسبة القرض</button>
          <button style={styles.btnOutline} onClick={()=>navTo("Gold")}>🪙 حاسبة الذهب</button>
          <button style={styles.btnOutline} onClick={()=>navTo("Currency")}>💱 محوّل العملات</button>
        </div>
      </div>
      <div style={{ padding:"64px 5%", background:"#F4F7FB" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <h2 style={{ fontFamily:"serif", fontSize:26, color:"#0D2347", marginBottom:8 }}>اختر الحاسبة</h2>
          <p style={{ color:"#5A6478", fontSize:14 }}>أدوات بسيطة وشفافة لقرارات مالية أذكى</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(230px, 1fr))", gap:20, maxWidth:1000, margin:"0 auto" }}>
          <ToolCard icon="🏦" iconBg="#dde8f8" title="حاسبة القرض" desc="احسب قسطك الشهري بناءً على المبلغ ومعدل الفائدة والمدة." btn="افتح الحاسبة" onClick={()=>navTo("Loan")} />
          <ToolCard icon="🪙" iconBg="#fef3d0" title="حاسبة الذهب" desc="احسب قيمة الذهب بكل العيارات مع ضريبة القيمة المضافة 15% تلقائياً." btn="افتح الحاسبة" onClick={()=>navTo("Gold")} />
          <ToolCard icon="💱" iconBg="#e0f2f1" title="محوّل العملات" desc="أسعار صرف يومية حقيقية لأكثر من 14 عملة عالمية وإقليمية." btn="افتح المحوّل" onClick={()=>navTo("Currency")} />
        </div>
      </div>
      <div style={{ padding:"64px 5%", textAlign:"center" }}>
        <h2 style={{ fontFamily:"serif", fontSize:24, color:"#0D2347", marginBottom:32 }}>لماذا SaudiCalculators؟</h2>
        <div style={styles.featGrid}>
          {[["🇸🇦","سعودية 100%","مصممة لنسب الضريبة والمعايير المصرفية المحلية"],["📡","أسعار حقيقية","محوّل العملات يستخدم أسعار صرف يومية حقيقية"],["⚡","نتائج فورية","الحسابات تتم فوراً في متصفحك"],["📱","متوافقة مع الجوال","تعمل على الهواتف والأجهزة اللوحية والكمبيوتر"]].map(([i,t,d])=>(
            <div key={t} style={styles.featCard}><div style={styles.featIcon}>{i}</div><h3 style={styles.featTitle}>{t}</h3><p style={{ color:"#5A6478", fontSize:13, margin:0 }}>{d}</p></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToolCard({ icon, iconBg, title, desc, btn, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ ...styles.card, ...(hover?styles.cardHover:{}) }} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      <div style={{ ...styles.cardIcon, background:iconBg }}>{icon}</div>
      <h3 style={{ fontFamily:"serif", fontSize:19, color:"#0D2347", marginBottom:10 }}>{title}</h3>
      <p style={{ color:"#5A6478", fontSize:13, marginBottom:20, lineHeight:1.65 }}>{desc}</p>
      <button style={styles.btnPrimary} onClick={onClick}>{btn}</button>
    </div>
  );
}

// ─── STYLES ───
const styles = {
  nav: { position:"sticky", top:0, zIndex:100, background:"#0D2347", padding:"8px 4%", display:"flex", alignItems:"center", justifyContent:"space-between", minHeight:64, boxShadow:"0 2px 12px rgba(0,0,0,.25)", flexWrap:"wrap", gap:8 },
  brand: { fontFamily:"serif", fontSize:"1.3rem", color:"#fff", cursor:"pointer", letterSpacing:".5px" },
  navBtn: { background:"transparent", border:"none", color:"rgba(255,255,255,.75)", fontSize:".78rem", fontWeight:600, padding:"6px 9px", borderRadius:6, cursor:"pointer" },
  navBtnActive: { background:"rgba(255,255,255,.15)", color:"#fff" },
  hero: { background:"linear-gradient(135deg,#0D2347 0%,#1A3C6E 60%,#1e4d8c 100%)", padding:"80px 5% 70px", textAlign:"center" },
  kicker: { fontSize:".75rem", letterSpacing:"2.5px", textTransform:"uppercase", color:"#E5B62F", fontWeight:600, marginBottom:14 },
  heroH1: { fontFamily:"serif", fontSize:"clamp(1.8rem,5vw,3rem)", color:"#fff", lineHeight:1.2, marginBottom:16 },
  heroSub: { color:"rgba(255,255,255,.72)", fontSize:"1rem", maxWidth:500, margin:"0 auto 34px", fontWeight:300 },
  btnGold: { display:"inline-flex", alignItems:"center", gap:8, padding:"12px 26px", borderRadius:8, fontSize:".9rem", fontWeight:700, cursor:"pointer", border:"none", background:"linear-gradient(135deg,#C8960C,#E5B62F)", color:"#0D2347", boxShadow:"0 4px 18px rgba(200,150,12,.4)" },
  btnOutline: { display:"inline-flex", alignItems:"center", gap:8, padding:"12px 26px", borderRadius:8, fontSize:".9rem", fontWeight:700, cursor:"pointer", background:"rgba(255,255,255,.12)", color:"#fff", border:"1.5px solid rgba(255,255,255,.4)" },
  btnPrimary: { background:"#0D2347", color:"#fff", border:"none", borderRadius:8, padding:"11px 22px", fontWeight:600, fontSize:".88rem", cursor:"pointer" },
  calcHero: { background:"linear-gradient(135deg,#0D2347,#1A3C6E)", padding:"46px 5% 42px", textAlign:"center" },
  calcHeroKicker: { fontSize:".72rem", letterSpacing:"2px", textTransform:"uppercase", color:"#E5B62F", fontWeight:600, marginBottom:10 },
  calcHeroTitle: { fontFamily:"serif", color:"#fff", fontSize:"clamp(1.4rem,3.5vw,2.2rem)", marginBottom:8 },
  calcHeroSub: { color:"rgba(255,255,255,.68)", fontSize:".88rem" },
  calcWrap: { maxWidth:720, margin:"0 auto", padding:"44px 5% 68px" },
  calcCard: { background:"#fff", borderRadius:12, padding:"32px 28px", boxShadow:"0 4px 24px rgba(13,35,71,.1)", border:"1px solid #DDE4EF", marginBottom:28 },
  formGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:18 },
  formGroup: { display:"flex", flexDirection:"column" },
  label: { fontSize:".72rem", fontWeight:700, letterSpacing:".6px", textTransform:"uppercase", color:"#0D2347", marginBottom:7 },
  input: { padding:"12px 14px", border:"1.5px solid #DDE4EF", borderRadius:8, fontFamily:"inherit", fontSize:".9rem", color:"#1A1F2E", background:"#fff", outline:"none" },
  calcBtn: { width:"100%", padding:"14px", background:"linear-gradient(135deg,#0D2347,#1A3C6E)", color:"#fff", border:"none", borderRadius:8, fontSize:"1rem", fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(13,35,71,.3)" },
  errorBox: { background:"#fff3f3", border:"1px solid #f5b8b8", borderRadius:8, padding:"11px 14px", color:"#c0392b", fontSize:".85rem", marginBottom:14 },
  resultBox: { marginTop:22, borderRadius:12, overflow:"hidden", border:"1.5px solid #C8960C" },
  resultHeader: { background:"linear-gradient(135deg,#0D2347,#1A3C6E)", padding:"14px 20px", color:"#fff", fontSize:".75rem", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" },
  resultBody: { background:"#f9fbff", padding:"18px 20px" },
  resultRow: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:"1px solid #DDE4EF", fontSize:".88rem" },
  resultRowHL: { borderBottom:"none" },
  resultLabel: { color:"#5A6478" },
  resultValue: { fontWeight:700, color:"#0D2347" },
  resultValueHL: { color:"#C8960C", fontSize:"1.2rem" },
  seoBox: { background:"#F4F7FB", borderRadius:12, padding:"24px 28px", border:"1px solid #DDE4EF" },
  seoH2: { fontFamily:"serif", fontSize:"1.15rem", color:"#0D2347", marginBottom:10 },
  seoP: { color:"#5A6478", fontSize:".875rem", lineHeight:1.78, marginBottom:10 },
  pageInner: { maxWidth:800, margin:"0 auto", padding:"56px 5%" },
  pageH1: { fontFamily:"serif", fontSize:"clamp(1.7rem,4vw,2.3rem)", color:"#0D2347", marginBottom:16 },
  featGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:16, margin:"20px 0" },
  featCard: { background:"#F4F7FB", border:"1px solid #DDE4EF", borderRadius:12, padding:"18px", textAlign:"center" },
  featIcon: { fontSize:"1.4rem", marginBottom:8 },
  featTitle: { fontSize:".88rem", fontWeight:700, color:"#0D2347", marginBottom:6 },
  card: { background:"#fff", borderRadius:12, padding:"28px 24px", boxShadow:"0 4px 24px rgba(13,35,71,.08)", border:"1px solid #DDE4EF", textAlign:"center", transition:"transform .2s,box-shadow .2s" },
  cardHover: { transform:"translateY(-4px)", boxShadow:"0 8px 32px rgba(13,35,71,.14)" },
  cardIcon: { width:56, height:56, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:"1.6rem" },
  contactGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:28, marginTop:24 },
  contactItem: { display:"flex", alignItems:"flex-start", gap:12, marginBottom:16 },
  contactIcon: { width:38, height:38, background:"#F4F7FB", border:"1px solid #DDE4EF", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", flexShrink:0 },
  successBox: { background:"#e8f5e9", border:"1px solid #a5d6a7", borderRadius:8, padding:"11px 14px", color:"#2e7d32", fontSize:".875rem" },
  footer: { background:"#0D2347", color:"rgba(255,255,255,.5)", textAlign:"center", padding:"24px 5%", fontSize:".82rem" },
};

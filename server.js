import express from "express";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.use(express.json());

// قاعدة بيانات بسيطة للمواقع
const sites = [
  { name: "موقع برمجة", url: "https://example.com/programming" },
  { name: "موقع تصميم", url: "https://example.com/design" }
];

// الصفحة الرئيسية (واجهة الشات)
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="ar">
  <head>
    <meta charset="UTF-8" />
    <title>مساعد مراد الذكي</title>
    <style>
      body { font-family: Arial; direction: rtl; text-align: center; background: #f7f7f7; }
      #chat { width: 80%; margin: auto; margin-top: 30px; background: #fff; padding: 20px; border-radius: 10px; }
      input { width: 70%; padding: 10px; }
      button { padding: 10px 20px; background: #007bff; color: #fff; border: none; border-radius: 5px; }
      .msg { margin: 10px; text-align: right; }
      .bot { color: green; }
    </style>
  </head>
  <body>
    <div id="chat">
      <h2>🤖 مساعد مراد الذكي</h2>
      <div id="messages"></div>
      <input type="text" id="question" placeholder="اكتب سؤالك هنا..." />
      <button onclick="ask()">إرسال</button>
    </div>
    <script>
      async function ask() {
        const q = document.getElementById("question").value;
        const res = await fetch("/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q })
        });
        const data = await res.json();
        const messages = document.getElementById("messages");
        messages.innerHTML += "<div class='msg'><b>👤 أنت:</b> " + q + "</div>";
        messages.innerHTML += "<div class='msg bot'><b>🤖 البوت:</b> " + data.answer + "</div>";
        document.getElementById("question").value = "";
      }
    </script>
  </body>
  </html>
  `);
});

// واجهة API لمعالجة الأسئلة
app.post("/ask", (req, res) => {
  const q = req.body.question;

  // منطق الإجابات
  if (q.includes("السلام") || q.includes("مرحبا")) {
    return res.json({ answer: "وعليكم السلام! كيف حالك؟ 😊" });
  }
  if (q.includes("اليوم")) {
    const today = new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    return res.json({ answer: `اليوم هو ${today}` });
  }
  if (q.includes("من صنعك")) {
    return res.json({ answer: "صنعني مراد الجهني بحفر الباطن." });
  }

  // البحث في قاعدة البيانات
  const results = sites.filter((s) => q.includes(s.name.split(" ")[1]));
  if (results.length > 0) {
    return res.json({
      answer:
        "وجدت هذه النتائج:<br>" +
        results.map((s) => `<a href="${s.url}" target="_blank">${s.name}</a>`).join("<br>")
    });
  }

  return res.json({ answer: "لم أجد إجابة لسؤالك، حاول بكلمات أخرى." });
});

// تشغيل الخادم (Bolt سيشغله تلقائياً)
app.listen(3000, () => {
  console.log("🚀 مساعد مراد الذكي يعمل الآن على Bolt!");
});
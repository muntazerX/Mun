import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK server-side
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Lean, token-efficient system instruction
const LEAN_SYSTEM_INSTRUCTION = `أنت العقل الراوي والمنسق للعبة تقمص الأدوار النصية "التربة القاتمة" (Grim Soil) — عالم فنتازيا مظلمة قاسية مستوحى من التراث العربي القديم والقرون الوسطى.
القواعد الجوهرية (التزم بالإيجاز الشديد وتوفير التوكنات والتجانس التام):
1. ولّد الأحداث، اللقاءات، الشخصيات، التحديات، والأوصاف تلقائياً وإجرائياً بالذكاء الاصطناعي بناءً على موقع اللاعب، بيئته، وأفعاله.
2. لا تكرر النصوص الثابتة أو القوائم الطويلة. اكتب بأسلوب عربي فصيح، مشوق، قاسٍ وموجز (فقرة إلى فقرتين سرديتين مركزتين فقط).
3. لا تتحدث بلسان اللاعب إطلاقاً. صف الفعل بصيغة الغائب وأبلغه بالنتيجة الصريحة.
4. السفر والتنقل بين المعالم: السفر سليم وسالم 100% دائماً بدون أي نرد قدر أو سيناريوهات تعطل أو عوائق. صف مشاهد الطريق بجمال واختصار ووصول المسافر بسلام إلى وجهته بعد انقضاء أيام السير المقررة.
5. نرد القدر: يُطلب فقط في المواقف القتالية الخطيرة أو المغامرات الاستثنائية التي يبادر بها اللاعب (وليس في السفر).
6. تجانس الأنظمة الدقيق:
   - الشراء والبيع: يخصم أو يضيف النقود بدقة في JSON.
   - استخدام عناصر الاستهلاك (طعام، ماء، جرعات، ضماد): ينعكس أثرها الإيجابي فوراً على الصحة أو الطاقة أو الجوع.
   - العلاقات السياسية: تنعكس على تعامل التجار والسكان (الترحيب أو الريبة).
7. في نهاية ردك، أضف دائماً كتلة JSON محاطة بـ \`\`\`json لتحديث الحالة بأرقام دقيقة ومنطقية:
\`\`\`json
{
  "playerUpdates": { "hpDelta": 0, "apDelta": 0, "xpGain": 5, "currencyDelta": { "C": 0, "S": 0, "G": 0 } },
  "event": "ملخص الحدث في جملة واحدة",
  "dangerEncounter": false
}
\`\`\``;

// Procedural generator fallback for when API key is offline or during high-demand spikes
function generateProceduralFallback(prompt: string, gameState: any) {
  const isTravel = /(سافر|أسافر|اذهب|أذهب|توجه|أتوجه|انطلق|أنطلق|رحلة|طريق)/i.test(prompt);
  const landmark = gameState?.player?.current_landmark || 'السهول الوسطى';
  const day = gameState?.world_state?.day || 1;

  if (isTravel) {
    const narrative = `بلغت رحلتك غايتها بسلام وأمان.
عبرت الدروب الممتدة تحت سماء القارة، متتبعاً معالم الطريق دون أي عوائق. وصلت إلى **${landmark}** بعد انقضاء مسيرك، حيث تستقر الأقدام وتتجدد الآمال مع انبلاج فجر اليوم ${day}.`;

    return {
      text: narrative,
      updates: {
        playerUpdates: { hpDelta: 0, apDelta: -2, xpGain: 8, currencyDelta: { C: 0, S: 0, G: 0 } },
        event: `وصول آمن إلى ${landmark}`,
        dangerEncounter: false
      }
    };
  }

  const roll = Math.floor(Math.random() * 100) + 1;
  let grade = 'عادي';
  if (roll <= 30) grade = 'كارثي';
  else if (roll <= 50) grade = 'قاسٍ';
  else if (roll <= 65) grade = 'بيثوري';
  else if (roll <= 85) grade = 'عادي';
  else grade = 'مثالي';

  const narrative = `🎲 نرد القدر: [${roll}/100] — ${grade}

في أرجاء ${landmark}، وفي اليوم ${day} فوق التربة القاتمة.
${prompt.trim() ? `استجابة لقرارك ("${prompt.trim()}"): ` : ''}${
    roll > 60
      ? `تمضي خطتك بنجاح، حيث تستغل معرفتك بتضاريس المكان وتبلغ مرادك بحنكة وتيقظ.`
      : `تواجه بعض المشقة والرياح المعاندة التي تتطلب حذرك وثباتك في كل خطوة مقبلة.`
  }

تتأمل الأفق المحيط بك فيما تتواصل حركة الحياة اليومية والقوافل في المنطقة.`;

  return {
    text: narrative,
    updates: {
      playerUpdates: {
        hpDelta: roll < 25 ? -5 : (roll > 85 ? 5 : 0),
        apDelta: -3,
        xpGain: 6,
        currencyDelta: { C: 0, S: 0, G: 0 }
      },
      event: `إجراء تفاعلي في ${landmark}`,
      diceRoll: roll,
      grade
    }
  };
}

// API chat endpoint with retry and modern Flash Lite model
app.post('/api/chat', async (req, res) => {
  const { message, gameState, recentHistory, extraDirective, model: requestedModel } = req.body;

  // Build ultra-lean state summary (saves 99% of tokens!)
  const p = gameState?.player || {};
  const w = gameState?.world_state || {};
  const l = gameState?.location || {};

  const leanContext = `[حالة اللعبة المصغرة]:
الموقع: ${p.current_landmark || l.sub_location || 'المدينة العظيمة'} (${l.region || 'السهول الوسطى'}) | اليوم: ${w.day || 1}
الحالة: HP: ${p.hp_current || 100}/${p.hp_max || 100} | AP: ${p.ap_current || 100}/${p.ap_max || 100} | ذهن: ${p.m_current || 10} | تركيز: ${p.s_current || 8} | المستوى: ${p.level || 1} (${p.rank || 'أفق الولادة'})
السلاح: ${p.weapon_equipped || 'سكين صدئ'} | الدرع: ${p.armor_equipped || 'عباءة صوفية'}
المال: ذهب ${p.currency?.G || 0}، فضة ${p.currency?.S || 0}، نحاس ${p.currency?.C || 0}
آخر الأحداث: ${(recentHistory || []).slice(-3).map((h: any) => h.content || h.text || '').join(' / ')}
${extraDirective ? `\n[توجيه محدد]:\n${extraDirective}` : ''}`;

  if (!ai || !apiKey) {
    const fallback = generateProceduralFallback(message || '', gameState);
    return res.json({
      content: fallback.text,
      updates: fallback.updates,
      source: 'procedural-offline'
    });
  }

  // Use gemini-3.5-flash-lite as the primary engine requested by the user
  const primaryModel = requestedModel || 'gemini-3.5-flash-lite';
  const candidateModels = [
    primaryModel,
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash-lite',
    'gemini-flash-latest',
    'gemini-3.8-flash'
  ];
  const fullPrompt = `${leanContext}\n\n[أمر اللاعب]:\n${message || 'تفقد المكان والبيئة من حولي وحالي'}`;

  // Try candidate models with graceful fallback on 503 or quota limits
  let lastError: any = null;
  for (const modelToTry of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelToTry,
        contents: fullPrompt,
        config: {
          systemInstruction: LEAN_SYSTEM_INSTRUCTION,
          temperature: 0.7,
          topP: 0.9,
        },
      });

      const replyText = response.text || '';
      if (replyText.trim()) {
        return res.json({
          content: replyText,
          source: 'gemini',
          model: modelToTry
        });
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${modelToTry} attempt failed, trying next candidate:`, err?.message || err);
    }
  }

  // If all Gemini calls failed (e.g. temporary 503 spike across all quotas), use the smooth procedural generator
  console.error('All AI models failed, using seamless procedural fallback:', lastError);
  const fallback = generateProceduralFallback(message || '', gameState);
  return res.json({
    content: fallback.text,
    updates: fallback.updates,
    source: 'procedural-fallback'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(apiKey), defaultModel: 'gemini-3.5-flash-lite' });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Grim Soil server running on port ${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer();

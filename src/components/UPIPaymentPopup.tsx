import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import StyledButton from "./common/StyledButton";
import { createWorker, type Worker, PSM } from "tesseract.js";
import { useUserDetailsStore } from "@/store";
import { toast } from "react-toastify";

const UPIPaymentPopup = ({
  upiId,
  amount,
  handleClose,
}: {
  upiId: string;
  amount: number;
  handleClose: () => void;
}) => {
  const storeName = useUserDetailsStore((state) => state.storeName);
  const isPremium = useUserDetailsStore((state) => state.isPremium);
  const UPIPaymentURL = storeName
    ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(storeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Paying to ${storeName}`)}`
    : `upi://pay?pa=${upiId}&am=${amount}&cu=INR`;
  const qrRef = useRef<HTMLDivElement>(null);
  const [readbleText, setReadableText] = useState("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [tooLateToScreenRecord, setTooLateToScreenRecord] = useState(false);

  const handleShareQR = async () => {
    if (!qrRef.current) return;

    try {
      const paymentLinkBody = {
        pa: upiId,
        pn: storeName,
        am: amount,
        tn: storeName ? `Paying to ${storeName}` : undefined,
      };
      console.log("hi");
      const response = await fetch(
        "https://miv-pay.vercel.app/api/generate-link",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentLinkBody),
        },
      );
      const result = await response.json();
      const link = result.data.link;
      if (result.success && link) {
        if (navigator.canShare && navigator.canShare({ url: link })) {
          try {
            await navigator.share({
              title: "Share payment link",
              text: "Share this to person you want to receive payment from.",
              url: link,
            });
          } catch (error) {
            console.error("Error sharing payment link:", error);
          }
        } else {
          try {
            await navigator.clipboard.writeText(link);
            toast.success("Payment link copied to clipboard!");
          } catch (error) {
            console.error("Failed to copy link to clipboard:", error);
          }
        }
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
      toast.error("Failed to generate image for sharing.");
    }
  };

  useEffect(() => {
    // If time runs out, mark it as too late and stop the timer
    if (timeLeft <= 0) {
      setTooLateToScreenRecord(true);
      return;
    }

    // Decrease the time left by 1 every second
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="fixed w-screen h-screen text-[1rem] font-normal z-50">
      <div
        onClick={handleClose}
        className="fixed top-0 left-0 w-screen h-screen bg-black/50"
      />
      <div className="fixed flex flex-col items-center gap-4 max-w-100 w-[calc(100vw-2rem)] md:w-100 top-[50%] left-[50%] transform-[translate(-50%,-50%)] rounded-(--corner-radius) p-4 bg-white text-black border-(--clr-border-grey-one) border">
        <div
          ref={qrRef}
          className="w-full aspect-square flex flex-col items-center gap-4 bg-white pb-4"
        >
          <div className="w-fit flex flex-col items-center gap-2">
            <label className="w-fit font-medium">Scan to Pay ₹{amount}</label>
            <span>
              to: {storeName && storeName} {upiId}
            </span>
          </div>
          <div className="relative flex justify-center w-full">
            <QRCodeCanvas
              value={UPIPaymentURL}
              level="H"
              size={500}
              style={{ width: "100%", height: "auto", maxWidth: "250px" }}
            />
            {/* <div className="absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)] text-[4rem] font-bold text-black [text-shadow:-4px_-4px_0_#fff,4px_-4px_0_#fff,-4px_4px_0_#fff,4px_4px_0_#fff]">
              ₹{readableAmount(amount)}
            </div> */}
          </div>
          <label className="w-fit font-medium hidden md:block">
            Scan and Pay via any UPI app
          </label>
          <label className="w-fit font-medium md:hidden">
            Share to UPI app and Pay
          </label>
        </div>
        <div className="w-full">
          <StyledButton
            title="Share QR"
            action={handleShareQR}
            heirarchy="primary"
            length="full-width"
          />
        </div>
        {isPremium &&
          (!tooLateToScreenRecord ? (
            <StyledButton
              title={`Verify via Screen Record (${timeLeft}s)`}
              action={() => verifyPayment(amount, setReadableText)}
              heirarchy="secondary"
              length="full-width"
              style={{
                backgroundColor: "white",
                border: "1px solid var(--clr-grey-one)",
              }}
            />
          ) : (
            <div className="w-full text-center p-2 rounded bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              Too late to capture notification. Please check your bank app
              manually.
            </div>
          ))}
        {readbleText && <span className="text-[12px]">{readbleText}</span>}
      </div>
    </div>
  );
};

export const readableAmount = (rawAmount: number): string => {
  const amount = rawAmount.toString();
  if (!amount || isNaN(Number(amount))) return amount;

  return new Intl.NumberFormat("en-IN").format(Number(amount));
};

let workerPromise: Promise<Worker> | null = null;

const getWorker = () =>
  (workerPromise ??= (async () => {
    const w = await createWorker("eng");
    await w.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK, // try PSM.SPARSE_TEXT if layout is messy
      user_defined_dpi: "300",
      preserve_interword_spaces: "1",
    });
    return w;
  })());

const speak = (message: string) => {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);

  // Set language to Hindi (India)
  utterance.lang = "hi-IN";
  utterance.rate = 1;
  utterance.volume = 1;

  // Fetch available voices
  const voices = window.speechSynthesis.getVoices();

  // Filter out the Hindi voices
  const hindiVoices = voices.filter((voice) => voice.lang.includes("hi"));

  if (hindiVoices.length > 0) {
    // Try to find a known female Hindi voice, otherwise fallback to the first Hindi voice
    const femaleVoice = hindiVoices.find(
      (voice) =>
        voice.name.includes("Female") ||
        voice.name.includes("Google") || // Google's default Hindi voice is female
        voice.name.includes("Swara") || // Microsoft Edge/Windows female voice
        voice.name.includes("Kalpana") || // Microsoft Windows female voice
        voice.name.includes("Lekha"), // Apple macOS/iOS female voice
    );

    utterance.voice = femaleVoice || hindiVoices[0];
  }

  window.speechSynthesis.speak(utterance);
};

const SCALE = 2.5;

// Crop top strip, upscale, grayscale, invert if dark, stretch contrast
const grabFrame = (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) => {
  const sw = video.videoWidth;
  const sh = Math.floor(video.videoHeight * 0.25);
  if (!sw || !sh) return false;

  canvas.width = Math.floor(sw * SCALE);
  canvas.height = Math.floor(sh * SCALE);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(video, 0, 0, sw, sh, 0, 0, canvas.width, canvas.height);

  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = img.data;

  let sum = 0;
  let min = 255;
  let max = 0;
  for (let i = 0; i < d.length; i += 4) {
    const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    d[i] = g;
    sum += g;
    if (g < min) min = g;
    if (g > max) max = g;
  }
  const invert = sum / (d.length / 4) < 128;
  const range = Math.max(1, max - min);

  for (let i = 0; i < d.length; i += 4) {
    let g = ((d[i] - min) / range) * 255;
    if (invert) g = 255 - g;
    d[i] = d[i + 1] = d[i + 2] = g;
    d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return true;
};

// Banks use "Rs.", "INR"; OCR often mangles ₹, so don't rely on it
const AMOUNT_RE = /(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/gi;
const CREDIT_RE = /credit|received|paid|sent you|deposited/i;

const matchesPayment = (text: string, amount: number) => {
  const amounts = [...text.matchAll(AMOUNT_RE)].map((m) =>
    parseFloat(m[1].replace(/,/g, "")),
  );

  return amounts.includes(amount) && CREDIT_RE.test(text);
};

export const verifyPayment = async (
  amount: number,
  setReadableText: (t: string) => void,
) => {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: { width: { ideal: 1920 }, frameRate: { ideal: 5 } },
    audio: false,
  });

  const video = document.createElement("video");
  video.srcObject = stream;
  video.muted = true;
  await video.play();

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const worker = await getWorker();

  let busy = false;
  let done = false;

  const stop = () => {
    if (done) return;
    done = true;
    clearInterval(interval);
    clearTimeout(timeout);
    stream.getTracks().forEach((t) => t.stop());
    video.srcObject = null;
  };

  const tick = async () => {
    if (busy || done) return;
    busy = true;
    try {
      if (!grabFrame(video, canvas, ctx)) return;
      const { data } = await worker.recognize(canvas);
      const text = data.text.trim();
      if (!text) return;
      setReadableText(text);
      if (matchesPayment(text, amount)) {
        speak(`₹${amount} का पेमेंट प्राप्त हुआ`);
        toast.success(`₹${amount} Payment Received!`);
        stop();
      }
    } finally {
      busy = false;
    }
  };

  const interval = setInterval(tick, 1000);
  const timeout = setTimeout(stop, 30_000);
  stream.getVideoTracks()[0].onended = stop;
};

export default UPIPaymentPopup;

import wave
import struct
import math
import base64

def generate_wav(filename, freq_func, duration, vol=0.5):
    sample_rate = 44100
    n_samples = int(sample_rate * duration)
    with wave.open(filename, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(sample_rate)
        for i in range(n_samples):
            t = float(i) / sample_rate
            v = freq_func(t) * vol * 32767.0
            if v > 32767: v = 32767
            if v < -32768: v = -32768
            f.writeframes(struct.pack('h', int(v)))

# Pop (frequency drop)
def pop_freq(t):
    # frequency drops from 800 to 200 quickly
    f = 800 * math.exp(-20 * t)
    # envelope drops from 1 to 0 quickly
    env = math.exp(-30 * t)
    return math.sin(2 * math.pi * f * t) * env

# Ding (success chord)
def ding_freq(t):
    # C5, E5, G5
    c = math.sin(2 * math.pi * 523.25 * t)
    e = math.sin(2 * math.pi * 659.25 * t)
    g = math.sin(2 * math.pi * 783.99 * t)
    env = math.exp(-5 * t)
    return ((c + e + g) / 3) * env

generate_wav('pop.wav', pop_freq, 0.15)
generate_wav('ding.wav', ding_freq, 0.5)

pop_b64 = base64.b64encode(open('pop.wav', 'rb').read()).decode('utf-8')
ding_b64 = base64.b64encode(open('ding.wav', 'rb').read()).decode('utf-8')

js_content = f"""import {{ useCallback, useRef }} from "react";

const POP_B64 = "data:audio/wav;base64,{pop_b64}";
const DING_B64 = "data:audio/wav;base64,{ding_b64}";

export function useSound() {{
  const popAudio = useRef<HTMLAudioElement | null>(null);
  const dingAudio = useRef<HTMLAudioElement | null>(null);

  if (typeof window !== "undefined") {{
    if (!popAudio.current) popAudio.current = new Audio(POP_B64);
    if (!dingAudio.current) dingAudio.current = new Audio(DING_B64);
  }}

  const playPop = useCallback(() => {{
    if (popAudio.current) {{
      popAudio.current.currentTime = 0;
      popAudio.current.play().catch(e => console.log("Audio play blocked", e));
    }}
  }}, []);

  const playSuccess = useCallback(() => {{
    if (dingAudio.current) {{
      dingAudio.current.currentTime = 0;
      dingAudio.current.play().catch(e => console.log("Audio play blocked", e));
    }}
  }}, []);

  return {{ playPop, playSuccess }};
}}
"""
with open('/Users/dungtuan/Downloads/EXE_History alive/Onboarding Flow Preservation/src/app/hooks/useSound.ts', 'w') as f:
    f.write(js_content)

print("Audio hook generated successfully.")

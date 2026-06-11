import base64

pop_b64 = base64.b64encode(open('soft_pop.wav', 'rb').read()).decode('utf-8')
bgm_b64 = base64.b64encode(open('bgm.wav', 'rb').read()).decode('utf-8')
ding_b64 = base64.b64encode(open('ding.wav', 'rb').read()).decode('utf-8')

js_content = f"""import {{ useCallback, useRef }} from "react";

export const POP_B64 = "data:audio/wav;base64,{pop_b64}";
export const DING_B64 = "data:audio/wav;base64,{ding_b64}";
export const BGM_B64 = "data:audio/wav;base64,{bgm_b64}";

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
with open('src/app/hooks/useSound.ts', 'w') as f:
    f.write(js_content)

print("Generated useSound.ts successfully.")

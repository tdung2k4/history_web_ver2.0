import wave
import struct
import math
import base64

def generate_wav(filename, generate_samples, duration):
    sample_rate = 11025
    n_samples = int(sample_rate * duration)
    with wave.open(filename, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(1) # 8-bit to save space
        f.setframerate(sample_rate)
        
        frames = bytearray()
        for i in range(n_samples):
            t = float(i) / sample_rate
            v = generate_samples(t) * 127 + 128
            if v > 255: v = 255
            if v < 0: v = 0
            frames.append(int(v))
        f.writeframes(frames)

# Soft Pop (bass bloop)
def soft_pop(t):
    f = 300 * math.exp(-15 * t)
    env = math.exp(-25 * t)
    return math.sin(2 * math.pi * f * t) * env * 0.6

# BGM (simple lullaby loop 4 seconds)
def bgm_loop(t):
    # notes: C4, E4, G4, A4 (261.63, 329.63, 392.00, 440.00)
    bpm = 120
    beat = int(t * (bpm/60)) % 8
    freqs = [261.63, 329.63, 392.00, 329.63, 261.63, 392.00, 440.00, 392.00]
    f = freqs[beat]
    # soft triangle wave
    val = (2 / math.pi) * math.asin(math.sin(2 * math.pi * f * t))
    env = math.exp(-2 * (t % 0.5))
    return val * env * 0.3

generate_wav('soft_pop.wav', soft_pop, 0.15)
generate_wav('bgm.wav', bgm_loop, 4.0)

pop_b64 = base64.b64encode(open('soft_pop.wav', 'rb').read()).decode('utf-8')
bgm_b64 = base64.b64encode(open('bgm.wav', 'rb').read()).decode('utf-8')

print(f"Pop size: {len(pop_b64)}")
print(f"BGM size: {len(bgm_b64)}")

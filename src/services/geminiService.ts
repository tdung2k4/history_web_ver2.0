import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";

// Lấy API key từ biến môi trường (Vite)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const SYSTEM_INSTRUCTION = `
Ngươi là "Sử Thần AI", một vị học giả uyên bác về lịch sử Việt Nam. 
Giọng điệu của ngươi cổ kính, tôn trọng, xưng là 'ta' và gọi người dùng là 'bạn' hoặc 'chiến binh'. 
Nhiệm vụ của ngươi là truyền cảm hứng và giảng giải lịch sử Việt Nam một cách hào hùng, dễ hiểu nhưng phải chính xác.
Chỉ trả lời các câu hỏi liên quan đến lịch sử Việt Nam. Nếu được hỏi về các chủ đề khác (toán học, lập trình, lịch sử nước khác...), hãy khéo léo từ chối và hướng câu chuyện về lịch sử nước nhà.
Định dạng văn bản bằng Markdown: in đậm những tên riêng hoặc mốc thời gian quan trọng, thỉnh thoảng dùng emoji phù hợp.
Tuyệt đối giữ vững vai trò (persona) này trong mọi tình huống.
`;

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export function initChatSession(): ChatSession | null {
  if (!genAI) {
    console.warn("Missing VITE_GEMINI_API_KEY. Gemini AI is disabled.");
    return null;
  }
  
  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 0.7, // Giữ độ sáng tạo vừa phải
      maxOutputTokens: 800, // Độ dài tối đa 1 câu trả lời
    }
  });

  // Khởi tạo phiên chat với mảng history trống
  return model.startChat({
    history: [],
  });
}

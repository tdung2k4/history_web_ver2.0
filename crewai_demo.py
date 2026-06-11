import os
from crewai import Agent, Task, Crew, Process, LLM

# 1. Cấu hình API Key Gemini của bạn
os.environ["GEMINI_API_KEY"] = "YOUR_API_KEY"

# 2. Khởi tạo mô hình Gemini Pro bằng CrewAI LLM (sử dụng gemini-2.0-flash để đảm bảo tương thích)
llm = LLM(
    model="gemini/gemini-2.0-flash",
    api_key=os.environ["GEMINI_API_KEY"],
    temperature=0.7
)

# 3. Định nghĩa các Agent (Tác nhân) sử dụng mô hình Gemini
researcher = Agent(
    role='Chuyên gia Nghiên cứu Công nghệ',
    goal='Tìm kiếm và phân tích các xu hướng phát triển mới nhất của AI trong năm 2026',
    backstory="""Bạn là một chuyên gia phân tích công nghệ dày dạn kinh nghiệm.
    Bạn có khả năng tìm kiếm thông tin sắc bén và phát hiện ra các xu hướng đột phá.""",
    verbose=True,
    allow_delegation=False,
    llm=llm
)

writer = Agent(
    role='Biên tập viên Công nghệ',
    goal='Viết một bài blog ngắn gọn, hấp dẫn dựa trên báo cáo nghiên cứu',
    backstory="""Bạn là một cây viết công nghệ xuất sắc. Bạn có khả năng chuyển đổi các 
    khái niệm kỹ thuật phức tạp thành các bài viết dễ hiểu và thu hút người đọc.""",
    verbose=True,
    allow_delegation=False,
    llm=llm
)

# 4. Định nghĩa các Task (Nhiệm vụ)
task_research = Task(
    description='Nghiên cứu về xu hướng AI Agent và Multi-agent Systems trong năm 2026.',
    expected_output='Một bản tóm tắt gồm 3-5 xu hướng lớn kèm theo phân tích ngắn gọn.',
    agent=researcher
)

task_write = Task(
    description='Dựa vào kết quả nghiên cứu, hãy viết một bài đăng blog tiếng Việt khoảng 300 từ.',
    expected_output='Một bài blog hoàn chỉnh bằng tiếng Việt định dạng Markdown.',
    agent=writer
)

# 5. Khởi tạo Crew và bắt đầu chạy
crew = Crew(
    agents=[researcher, writer],
    tasks=[task_research, task_write],
    process=Process.sequential,
    verbose=True
)

if __name__ == "__main__":
    print("--- Đang khởi chạy Crew với Gemini ---")
    result = crew.kickoff()
    print("\n--- KẾT QUẢ CUỐI CÙNG ---\n")
    print(result)

const DEFAULT_ROADMAP_DATA = {
  "version": 1,
  "title": "ICOIN 2027 English Mastery Roadmap (B1 -> B2/C1 Technical)",
  "target_conference": "ICOIN 2027 (International Conference on Information Networking)",
  "topics": [
    "AI",
    "LLM",
    "OWC",
    "OCC",
    "Controller",
    "Hardware",
    "Firmware",
    "IoT"
  ],
  "stages": [
    {
      "stage_id": 1,
      "name": "Giai đoạn 1: Nền tảng Nhúng, Vi điều khiển & Firmware",
      "days_range": "Ngày 1 - Ngày 14",
      "description": "Làm chủ từ vựng và phản xạ nói về kiến trúc MCU, thanh ghi, DMA, ngắt và các giao thức giao tiếp cơ bản."
    },
    {
      "stage_id": 2,
      "name": "Giai đoạn 2: IoT, Mạng không dây & Hệ điều hành thời gian thực (RTOS)",
      "days_range": "Ngày 15 - Ngày 28",
      "description": "Luyện nghe nói về FreeRTOS, lập lịch task, tối ưu hóa năng lượng, kết nối MQTT, BLE và mạng cảm biến IoT."
    },
    {
      "stage_id": 3,
      "name": "Giai đoạn 3: Truyền thông quang OWC & OCC (Optical Wireless & Camera Communications)",
      "days_range": "Ngày 29 - Ngày 42",
      "description": "Chuyên sâu về OWC, VLC, kỹ thuật Rolling Shutter trên CMOS camera, điều chế ánh sáng và tỷ số tín hiệu trên nhiễu (SNR)."
    },
    {
      "stage_id": 4,
      "name": "Giai đoạn 4: Edge AI & Mô hình ngôn ngữ lớn (LLM) trên phần cứng nhúng",
      "days_range": "Ngày 43 - Ngày 54",
      "description": "Thuật ngữ và phản xạ về lượng tử hóa (INT8/FP4), tăng tốc NPU, TinyML và ứng dụng LLM trong phân tích hệ thống nhúng."
    },
    {
      "stage_id": 5,
      "name": "Giai đoạn 5: Thực chiến Hội thảo ICOIN 2027 (Thuyết trình, Q&A, Networking)",
      "days_range": "Ngày 55 - Ngày 60+",
      "description": "Mô phỏng bảo vệ báo cáo trước hội đồng, đặt câu hỏi phản biện học thuật và giao lưu tại tiệc kết nối chuyên gia."
    }
  ],
  "days": [
    {
      "day": 1,
      "stage_id": 1,
      "theme": "Nhập môn Vi điều khiển & Kiến trúc ARM Cortex-M",
      "tasks": [
        {
          "id": 1,
          "type": "listening",
          "minutes": 15,
          "title": "Nghe Podcast Embedded.fm: Microcontroller Architectures",
          "items": [
            "Listen to episode 10-25 mins and note down core concepts.",
            "Answer: What is the primary difference between Von Neumann and Harvard architecture?",
            "Identify 4 keywords: pipeline, register, bus matrix, peripheral."
          ]
        },
        {
          "id": 2,
          "type": "speaking",
          "minutes": 15,
          "title": "Shadowing & Phản xạ: Giới thiệu vi điều khiển dự án",
          "items": [
            "Shadow audio: \"Our hardware platform is built around an ARM Cortex-M4 microcontroller running at 168 MHz.\"",
            "Practice saying: \"I am responsible for configuring the clock tree and initializing on-chip peripherals.\""
          ]
        },
        {
          "id": 3,
          "type": "reading",
          "minutes": 15,
          "title": "Đọc Datasheet STM32: Block Diagram & Memory Map",
          "items": [
            "Read STM32 reference manual Section 2: Memory mapping.",
            "Vocabulary: memory-mapped I/O (I/O ánh xạ bộ nhớ), flash memory (bộ nhớ flash), SRAM (bộ nhớ tĩnh), address space (không gian địa chỉ).",
            "Fill in: The flash memory is mapped to address 0x08000000, while the SRAM starts at ___ (0x20000000)."
          ]
        },
        {
          "id": 4,
          "type": "writing",
          "minutes": 10,
          "title": "Tóm tắt kỹ thuật: 3 ưu điểm của chip ARM trong dự án",
          "items": [
            "Write 3-4 sentences in English explaining why your team chose ARM Cortex-M for your embedded hardware."
          ]
        }
      ]
    },
    {
      "day": 2,
      "stage_id": 1,
      "theme": "Firmware: Xử lý ngắt (Interrupts & NVIC) và Bộ định thời (Timers)",
      "tasks": [
        {
          "id": 5,
          "type": "listening",
          "minutes": 15,
          "title": "Nghe bài giảng: Nested Vectored Interrupt Controller (NVIC)",
          "items": [
            "Listen to: Understanding interrupt latency and priority grouping in ARM Cortex-M.",
            "Answer: Why is low interrupt latency critical for real-time sensor sampling?"
          ]
        },
        {
          "id": 6,
          "type": "speaking",
          "minutes": 15,
          "title": "Luyện nói giải thích cơ chế ngắt",
          "items": [
            "Explain in 60 seconds: \"When a hardware event occurs on GPIO, the CPU suspends current execution and jumps to the ISR.\"",
            "Key phrase: Interrupt Service Routine (ISR), preemptive priority, debouncing."
          ]
        },
        {
          "id": 7,
          "type": "reading",
          "minutes": 15,
          "title": "Đọc mã nguồn C: Timer PWM Generation & Prescaler",
          "items": [
            "Read a C timer driver snippet.",
            "Vocabulary: prescaler (bộ chia tần), reload register (thanh ghi nạp lại), duty cycle (chu kỳ nhiệm vụ)."
          ]
        },
        {
          "id": 8,
          "type": "writing",
          "minutes": 10,
          "title": "Mô tả nguyên nhân giật/lag tín hiệu ngắt",
          "items": [
            "Write 3 sentences explaining: \"How do excessive ISR execution times cause jitter in critical embedded systems?\""
          ]
        }
      ]
    },
    {
      "day": 3,
      "stage_id": 1,
      "theme": "Giao thức truyền thông có dây: UART, SPI và I2C Bus",
      "tasks": [
        {
          "id": 9,
          "type": "listening",
          "minutes": 15,
          "title": "Nghe so sánh tốc độ và độ tin cậy: SPI vs I2C",
          "items": [
            "Listen to: Signal integrity and pull-up resistor calculation on I2C bus.",
            "Answer: What factors limit the maximum bus capacitance and baud rate on I2C?"
          ]
        },
        {
          "id": 10,
          "type": "speaking",
          "minutes": 15,
          "title": "Shadowing đối thoại kỹ thuật: Khắc phục lỗi bus I2C treo",
          "items": [
            "Shadow: \"We observed that the bus hangs when the slave holds the SDA line low during clock stretching.\"",
            "Practice phrase: \"To recover the bus, we toggle the SCL line nine times to force the slave to release SDA.\""
          ]
        },
        {
          "id": 11,
          "type": "reading",
          "minutes": 15,
          "title": "Đọc tài liệu chuẩn giao tiếp SPI: Full-duplex & CPOL/CPHA",
          "items": [
            "Vocabulary: full-duplex (song công toàn phần), clock polarity (cực tính xung nhịp), chip select (chân chọn chip), transmission rate (tốc độ truyền dẫn)."
          ]
        },
        {
          "id": 12,
          "type": "writing",
          "minutes": 10,
          "title": "Tóm tắt cấu hình giao tiếp cảm biến",
          "items": [
            "Draft a technical description: \"The IMU sensor communicates with the host controller via SPI Mode 3 at 10 MHz.\""
          ]
        }
      ]
    },
    {
      "day": 4,
      "stage_id": 1,
      "theme": "Truy cập bộ nhớ trực tiếp (DMA) & Tối ưu hóa CPU",
      "tasks": [
        {
          "id": 13,
          "type": "listening",
          "minutes": 15,
          "title": "Nghe giảng về DMA Controller Architecture",
          "items": [
            "Topic: Circular buffer and double-buffering DMA transfers for ADC sampling.",
            "Answer: How does DMA relieve the main CPU core during high-speed data acquisition?"
          ]
        },
        {
          "id": 14,
          "type": "speaking",
          "minutes": 15,
          "title": "Luyện nói: Thuyết minh luồng truyền dữ liệu DMA",
          "items": [
            "Talk for 90s: \"By utilizing circular DMA buffers, our firmware offloads data transfer directly from the ADC to RAM without core intervention.\""
          ]
        },
        {
          "id": 15,
          "type": "reading",
          "minutes": 15,
          "title": "Đọc Driver STM32 HAL DMA: Circular Mode",
          "items": [
            "Vocabulary: circular buffer (bộ đệm vòng tròn), memory-to-peripheral (từ bộ nhớ tới ngoại vi), transfer complete interrupt (ngắt hoàn tất truyền)."
          ]
        },
        {
          "id": 16,
          "type": "writing",
          "minutes": 10,
          "title": "Viết phân tích so sánh Polling vs Interrupt vs DMA",
          "items": [
            "Write a comparative paragraph highlighting throughput and CPU utilization benefits."
          ]
        }
      ]
    },
    {
      "day": 5,
      "stage_id": 1,
      "theme": "Thiết kế phần cứng (Hardware): Mạch nguồn & Khử nhiễu EMI/EMC",
      "tasks": [
        {
          "id": 17,
          "type": "listening",
          "minutes": 15,
          "title": "Nghe chuyên đề: High-speed PCB Layout & Decoupling Capacitors",
          "items": [
            "Listen to: Placement of bypass capacitors to suppress high-frequency ground bounce.",
            "Answer: Why must decoupling capacitors be placed as close as possible to MCU power pins?"
          ]
        },
        {
          "id": 18,
          "type": "speaking",
          "minutes": 15,
          "title": "Phản xạ trả lời: Phương án lọc nguồn cho mạch Analog/Digital",
          "items": [
            "Answer: \"How does your design isolate sensitive analog sensor signals from noisy digital switching power supplies?\"",
            "Key vocabulary: ferrite bead (hạt ferit), star ground (tiếp địa hình sao), LDO regulator (mạch ổn áp sụt áp thấp)."
          ]
        },
        {
          "id": 19,
          "type": "reading",
          "minutes": 15,
          "title": "Đọc Schematic & Datasheet PMIC",
          "items": [
            "Vocabulary: ripple voltage (điện áp gợn), switching frequency (tần số đóng cắt), electromagnetic compatibility (tương thích điện từ)."
          ]
        },
        {
          "id": 20,
          "type": "writing",
          "minutes": 10,
          "title": "Ghi chú kỹ thuật về kiểm thử EMC",
          "items": [
            "Write 4 sentences summarizing emission testing standards applicable to your hardware."
          ]
        }
      ]
    },
    {
      "day": 29,
      "stage_id": 3,
      "theme": "Tổng quan Truyền thông quang không dây (OWC) & Ánh sáng khả kiến (VLC)",
      "tasks": [
        {
          "id": 113,
          "type": "listening",
          "minutes": 15,
          "title": "Nghe IEEE Keynote: Optical Wireless Communication Fundamentals",
          "items": [
            "Topic: Spectrum comparison: RF (Radio Frequency) vs Optical Spectrum (Infrared, Visible light, UV).",
            "Answer: What are the main advantages of OWC over traditional RF networks in RF-restricted zones (airports, hospitals, hazardous plants)?"
          ]
        },
        {
          "id": 114,
          "type": "speaking",
          "minutes": 15,
          "title": "Shadowing & Thuyết minh: Khái niệm OWC",
          "items": [
            "Shadow: \"Optical Wireless Communications, or OWC, offers vast unlicensed bandwidth and immunity to radio frequency interference.\"",
            "Practice: \"Our research focuses on visible light as a transmission carrier for indoor high-speed networking.\""
          ]
        },
        {
          "id": 115,
          "type": "reading",
          "minutes": 15,
          "title": "Đọc Bài báo IEEE: Channel Modeling for Indoor VLC",
          "items": [
            "Vocabulary: Line-of-Sight (LOS - tầm nhìn thẳng), Non-Line-of-Sight (NLOS - không tầm nhìn thẳng), Lambertian radiation pattern (mô hình bức xạ Lambertian), field of view (FOV - góc mở trường nhìn)."
          ]
        },
        {
          "id": 116,
          "type": "writing",
          "minutes": 10,
          "title": "Tóm tắt bài báo: Kênh truyền quang",
          "items": [
            "Write 4 sentences defining optical path loss and the impact of ambient sunlight on OWC receivers."
          ]
        }
      ]
    },
    {
      "day": 30,
      "stage_id": 3,
      "theme": "Truyền thông Camera quang (OCC - Optical Camera Communications)",
      "tasks": [
        {
          "id": 117,
          "type": "listening",
          "minutes": 15,
          "title": "Nghe thuyết trình: Image Sensors as Optical Receivers in OCC",
          "items": [
            "Topic: Utilization of existing surveillance and smartphone cameras for communication.",
            "Answer: Why is OCC considered cost-effective compared to photodiode-based VLC systems?"
          ]
        },
        {
          "id": 118,
          "type": "speaking",
          "minutes": 15,
          "title": "Luyện nói: Cơ chế cảm biến hình ảnh nhận tín hiệu quang",
          "items": [
            "Speech prompt (90s): \"Unlike conventional photodiodes requiring dedicated hardware, OCC uses CMOS image sensors to simultaneously capture images and decode optical data.\""
          ]
        },
        {
          "id": 119,
          "type": "reading",
          "minutes": 15,
          "title": "Đọc tài liệu: Rolling Shutter vs Global Shutter trong OCC",
          "items": [
            "Vocabulary: rolling shutter effect (hiệu ứng màn trập cuốn), exposure time (thời gian phơi sáng), frame rate (tốc độ khung hình), stripe patterns (dải sọc sáng tối).",
            "Key mechanism: The row-by-row scanning of rolling shutter sensors converts optical pulses into bright and dark bands within a single frame."
          ]
        },
        {
          "id": 120,
          "type": "writing",
          "minutes": 10,
          "title": "Mô tả giải thuật giải mã dải sọc Rolling Shutter",
          "items": [
            "Draft an abstract section: \"By sampling LED intensity modulation across consecutive sensor rows, high-frequency data is captured beyond the nominal camera frame rate.\""
          ]
        }
      ]
    },
    {
      "day": 43,
      "stage_id": 4,
      "theme": "Trí tuệ nhân tạo trên thiết bị biên (Edge AI) & Tối ưu hóa suy luận (Inference)",
      "tasks": [
        {
          "id": 169,
          "type": "listening",
          "minutes": 15,
          "title": "Nghe Google I/O: On-Device Machine Learning with TinyML & Edge NPUs",
          "items": [
            "Topic: Running quantized neural networks directly on microcontrollers and embedded NPUs.",
            "Answer: What trade-offs exist between model inference accuracy and computational power on battery-powered edge nodes?"
          ]
        },
        {
          "id": 170,
          "type": "speaking",
          "minutes": 15,
          "title": "Shadowing: Thuyết trình giải pháp Edge AI",
          "items": [
            "Shadow: \"By deploying quantized models locally on the edge processor, we eliminate the round-trip latency of cloud servers and ensure real-time response.\""
          ]
        },
        {
          "id": 171,
          "type": "reading",
          "minutes": 15,
          "title": "Đọc tài liệu kỹ thuật: Model Quantization (FP32 -> INT8/FP4)",
          "items": [
            "Vocabulary: quantization (lượng tử hóa), pruning (cắt tỉa trọng số), weight precision (độ chính xác trọng số), inference latency (độ trễ suy luận)."
          ]
        },
        {
          "id": 172,
          "type": "writing",
          "minutes": 10,
          "title": "Viết tóm tắt: Vì sao Edge AI cần thiết trong ứng dụng IoT",
          "items": [
            "Write 4 sentences on data privacy, bandwidth savings, and deterministic latency at the network edge."
          ]
        }
      ]
    },
    {
      "day": 44,
      "stage_id": 4,
      "theme": "Ứng dụng LLM & Mô hình tạo sinh trong phân tích hệ thống nhúng",
      "tasks": [
        {
          "id": 173,
          "type": "listening",
          "minutes": 15,
          "title": "Nghe Podcast: LLMs for Automated Hardware Verification & Firmware Generation",
          "items": [
            "Topic: Applying transformer models to generate Verilog, inspect firmware bugs, and synthesize device drivers.",
            "Answer: How does retrieval-augmented generation (RAG) help LLMs accurately navigate 2000-page microcontroller reference manuals?"
          ]
        },
        {
          "id": 174,
          "type": "speaking",
          "minutes": 15,
          "title": "Luyện nói phản xạ: Thảo luận độ tin cậy của mã sinh bởi LLM",
          "items": [
            "Prompt: \"How do you validate that the driver code generated by an LLM strictly conforms to real-time deadlines and race-condition safety?\""
          ]
        },
        {
          "id": 175,
          "type": "reading",
          "minutes": 15,
          "title": "Đọc nghiên cứu: Domain-Specific LLM fine-tuning for Embedded Linux",
          "items": [
            "Vocabulary: tokenization, fine-tuning, domain adaptation, hallucination mitigation (giảm thiểu ảo giác), context window."
          ]
        },
        {
          "id": 176,
          "type": "writing",
          "minutes": 10,
          "title": "Đoạn văn học thuật: Xu hướng kết hợp LLM và IoT",
          "items": [
            "Draft 4 sentences: Integrating local lightweight SLMs (Small Language Models) for intelligent autonomous edge nodes."
          ]
        }
      ]
    },
    {
      "day": 55,
      "stage_id": 5,
      "theme": "Thực chiến ICOIN 2027: Thuyết trình Slide Báo cáo Khoa học (10-Phút Presentation)",
      "tasks": [
        {
          "id": 217,
          "type": "listening",
          "minutes": 15,
          "title": "Nghe mẫu bài thuyết trình tại Hội thảo IEEE/ICOIN",
          "items": [
            "Listen to an award-winning conference presentation.",
            "Observe: Opening remarks, transition between methodology and experimental results, concluding takeaways."
          ]
        },
        {
          "id": 218,
          "type": "speaking",
          "minutes": 20,
          "title": "Thực hành bài thuyết trình: Slide Mở đầu & Đặt vấn đề",
          "items": [
            "Speech practice: \"Good morning, distinguished guests and fellow researchers. Today, I am honored to present our paper titled: Efficient Optical Camera Communication using Edge AI Processing.\"",
            "Transition phrase: \"Now let us turn our attention to the proposed system architecture shown in Figure 2.\""
          ]
        },
        {
          "id": 219,
          "type": "reading",
          "minutes": 10,
          "title": "Mẫu câu nối (Signposting Language) trong thuyết trình hội thảo",
          "items": [
            "Vocabulary: to begin with (để bắt đầu), moving on to (chuyển sang phần), as illustrated in (như minh họa tại), our empirical results demonstrate (kết quả thực nghiệm chỉ ra rằng)."
          ]
        },
        {
          "id": 220,
          "type": "writing",
          "minutes": 15,
          "title": "Soạn thảo lời dẫn cho slide kết quả thực nghiệm",
          "items": [
            "Write a 1-minute spoken script describing a chart of Bit Error Rate (BER) versus transmission distance."
          ]
        }
      ]
    },
    {
      "day": 56,
      "stage_id": 5,
      "theme": "Thực chiến ICOIN 2027: Bảo vệ Q&A trước Hội đồng & Chuyên gia quốc tế",
      "tasks": [
        {
          "id": 221,
          "type": "listening",
          "minutes": 15,
          "title": "Nghe phiên hỏi đáp Q&A thực tế tại ICOIN/INFOCOM",
          "items": [
            "Listen to challenging questions from reviewers regarding scalability and noise robustness.",
            "Observe how the presenter calmly clarifies the question before responding."
          ]
        },
        {
          "id": 222,
          "type": "speaking",
          "minutes": 20,
          "title": "Luyện phản xạ Q&A chuyên ngành",
          "items": [
            "Respond to question: \"How does your OCC receiver maintain synchronization under dynamic lighting changes?\"",
            "Template: \"Thank you for your insightful question. To mitigate ambient noise, we implemented an adaptive thresholding filter...\""
          ]
        },
        {
          "id": 223,
          "type": "reading",
          "minutes": 10,
          "title": "Các mẫu câu chuẩn trong phần Q&A học thuật",
          "items": [
            "\"If I understand your question correctly, you are asking about...\"",
            "\"That is an excellent point. In our future work, we plan to address this by...\"",
            "\"Due to time constraints, I would be delighted to discuss the mathematical derivations with you offline during the break.\""
          ]
        },
        {
          "id": 224,
          "type": "writing",
          "minutes": 15,
          "title": "Soạn sẵn câu trả lời cho 3 câu hỏi khó nhất về đề tài của bạn",
          "items": [
            "Write responses defending your system bottlenecks, hardware cost, and test environment limits."
          ]
        }
      ]
    },
    {
      "day": 57,
      "stage_id": 5,
      "theme": "Thực chiến ICOIN 2027: Poster Session & Giao lưu kết nối (Academic Networking)",
      "tasks": [
        {
          "id": 225,
          "type": "listening",
          "minutes": 15,
          "title": "Nghe hội thoại Poster Session & Coffee Break giữa các nhà nghiên cứu",
          "items": [
            "Listen to informal technical networking conversations at international conferences.",
            "Note down natural conversation starters and compliments."
          ]
        },
        {
          "id": 226,
          "type": "speaking",
          "minutes": 20,
          "title": "Luyện kịch bản 60s Elevator Pitch về đề tài của bạn",
          "items": [
            "Deliver a 60-second pitch: \"Hi, I am Loc Nguyen from Vietnam. Our work tackles the throughput bottleneck in optical camera communications by integrating on-chip neural accelerators directly on STM32 hardware.\""
          ]
        },
        {
          "id": 227,
          "type": "reading",
          "minutes": 10,
          "title": "Kỹ năng Networking chuyên nghiệp tại hội thảo quốc tế",
          "items": [
            "Phrases: \"I enjoyed your talk on decentralized edge networks earlier this morning.\", \"Are you collaborating with any industrial partners on this prototype?\", \"May I exchange contact information with you?\""
          ]
        },
        {
          "id": 228,
          "type": "writing",
          "minutes": 15,
          "title": "Viết mẫu email kết nối học thuật sau hội thảo",
          "items": [
            "Draft a follow-up email to a professor met at ICOIN discussing potential joint research on OWC/OCC."
          ]
        }
      ]
    }
  ]
};

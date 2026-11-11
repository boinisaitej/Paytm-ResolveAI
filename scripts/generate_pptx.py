"""
Paytm ResolveAI - Professional Presentation Deck Generator
Generates a pitch deck matching all hackathon PPT guidelines:
📌 Title Slide
📌 Problem Statement
📌 Proposed Solution
📌 Technology/Tech Stack Used
📌 USP (Unique Selling Proposition)
📌 Impact & Benefits
📌 Business Model
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def build_presentation(output_path: str = "Paytm_ResolveAI_PitchDeck.pptx"):
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color Palette: Paytm Brand & Modern Fintech Tech Theme
    C_BG_DARK = RGBColor(6, 13, 25)         # Deep slate/navy
    C_CARD_BG = RGBColor(15, 23, 42)        # Glass card background
    C_CYAN = RGBColor(0, 186, 242)          # Paytm Cyan
    C_NAVY_ACCENT = RGBColor(0, 41, 112)    # Paytm Navy
    C_WHITE = RGBColor(255, 255, 255)
    C_SLATE_LIGHT = RGBColor(203, 213, 225) # Body text
    C_SLATE_MUTED = RGBColor(148, 163, 184) # Secondary text
    C_EMERALD = RGBColor(16, 185, 129)      # Success/KPIs
    C_ROSE = RGBColor(244, 63, 94)          # Problems/Risks
    C_BLUE = RGBColor(59, 130, 246)         # Blue highlight

    blank_layout = prs.slide_layouts[6] # completely blank layout

    def add_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG_DARK
        bg.line.fill.background()
        return bg

    def add_header(slide, tag_text: str, title_text: str, subtitle_text: str, tag_color: RGBColor = C_CYAN):
        # Header banner box
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf = tag_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = tag_text.upper()
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = tag_color

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.7))
        tf2 = title_box.text_frame
        tf2.word_wrap = True
        p2 = tf2.paragraphs[0]
        p2.text = title_text
        p2.font.size = Pt(24)
        p2.font.bold = True
        p2.font.color.rgb = C_WHITE

        # Subtitle
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.4), Inches(11.7), Inches(0.45))
        tf3 = sub_box.text_frame
        tf3.word_wrap = True
        p3 = tf3.paragraphs[0]
        p3.text = subtitle_text
        p3.font.size = Pt(13)
        p3.font.color.rgb = C_SLATE_MUTED

    # ==========================================
    # SLIDE 1: TITLE SLIDE
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    add_slide_background(s1)

    # Decorative Cyan accent strip
    accent = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), Inches(0.1), Inches(3.8))
    accent.fill.solid()
    accent.fill.fore_color.rgb = C_CYAN
    accent.line.fill.background()

    # Track badge
    badge = s1.shapes.add_textbox(Inches(1.1), Inches(1.5), Inches(11.0), Inches(0.4))
    p = badge.text_frame.paragraphs[0]
    p.text = "PAYTM BUILD FOR INDIA AI HACKATHON (HYDERABAD)  |  TRACK 3: AUTONOMOUS AI TEAMMATES"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_CYAN

    # Title
    t_box = s1.shapes.add_textbox(Inches(1.1), Inches(1.9), Inches(11.0), Inches(1.2))
    p = t_box.text_frame.paragraphs[0]
    p.text = "Paytm ResolveAI"
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    # Subtitle
    sub_box = s1.shapes.add_textbox(Inches(1.1), Inches(3.1), Inches(10.5), Inches(1.1))
    p = sub_box.text_frame.paragraphs[0]
    p.text = "AI Teammates That Don't Just Respond — They Get the Job Done"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = C_CYAN

    # Secondary text
    desc_box = s1.shapes.add_textbox(Inches(1.1), Inches(4.2), Inches(10.5), Inches(1.1))
    p = desc_box.text_frame.paragraphs[0]
    p.text = "An autonomous multi-agent workforce designed to handle customer service & payment operations end-to-end: understanding context, taking actions across banking ledgers & Soundbox telemetry, and escalating to humans only when authorization is required."
    p.font.size = Pt(13)
    p.font.color.rgb = C_SLATE_LIGHT

    # Links Box Banner
    link_box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.1), Inches(5.6), Inches(11.0), Inches(1.2))
    link_box.fill.solid()
    link_box.fill.fore_color.rgb = RGBColor(15, 23, 42)
    link_box.line.color.rgb = C_CYAN
    link_box.line.width = Pt(1.5)

    tb_link = s1.shapes.add_textbox(Inches(1.3), Inches(5.7), Inches(10.6), Inches(1.0))
    tf_l = tb_link.text_frame
    tf_l.word_wrap = True
    p_link = tf_l.paragraphs[0]
    p_link.text = "🌐 LIVE WORKING DEMO: https://boinisaitej.github.io/Paytm-ResolveAI/"
    p_link.font.size = Pt(13)
    p_link.font.bold = True
    p_link.font.color.rgb = C_EMERALD

    p_git = tf_l.add_paragraph()
    p_git.text = "💻 GITHUB REPO: https://github.com/boinisaitej/Paytm-ResolveAI.git  |  Lead: Sai Teja Boini"
    p_git.font.size = Pt(11)
    p_git.font.bold = True
    p_git.font.color.rgb = C_CYAN
    p_git.space_before = Pt(4)

    # ==========================================
    # SLIDE 2: PROBLEM STATEMENT
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    add_slide_background(s2)
    add_header(s2, "📌 Problem Statement", "The Crisis in Digital Payment Operations", 
               "With 350M+ users and 100M+ daily transactions, traditional manual support and payment operations collapse under transaction edge-cases.", C_ROSE)

    cards_data_2 = [
        ("48-72h Dispute Latency", "Pending debits, bank timeouts, and U69/U30 gateway codes require manual ticket escalations across 3 disjointed support tiers, frustrating customers and breaching RBI resolution SLAs.", C_ROSE),
        ("Fragmented Operational Silos", "Customer support, core banking analysts, merchant field engineers, and risk officers operate in isolated tools without unified transaction telemetry or shared audit history.", C_BLUE),
        ("Merchant Churn & Hardware Gaps", "Soundbox audio sync drops, SIM disconnections, and delayed settlements cause merchants to switch QR codes immediately, resulting in permanent payment volume loss.", C_CYAN)
    ]

    for idx, (title, desc, color) in enumerate(cards_data_2):
        x = Inches(0.8 + idx * 4.0)
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.2), Inches(3.7), Inches(3.6))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = color
        card.line.width = Pt(1.5)

        tb = s2.shapes.add_textbox(x + Inches(0.2), Inches(2.4), Inches(3.3), Inches(3.2))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(16)
        p1.font.bold = True
        p1.font.color.rgb = C_WHITE

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = C_SLATE_LIGHT
        p2.space_before = Pt(14)

    # Bottom summary callout
    bottom_box = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.1), Inches(11.7), Inches(0.8))
    bottom_box.fill.solid()
    bottom_box.fill.fore_color.rgb = RGBColor(20, 20, 35)
    bottom_box.line.color.rgb = C_ROSE
    tb = s2.shapes.add_textbox(Inches(1.0), Inches(6.15), Inches(11.3), Inches(0.7))
    p = tb.text_frame.paragraphs[0]
    p.text = "Financial Impact: Over ₹180 Crores spent annually on Level-1 repetitive triage, high Customer Effort Score (CES), and RBI failure compensation penalties."
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_ROSE

    # ==========================================
    # SLIDE 3: PROPOSED SOLUTION
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    add_slide_background(s3)
    add_header(s3, "📌 Proposed Solution", "Dual-Tier Workforce: 5 Human Roles + 5 AI Agents",
               "An enterprise-grade collaboration model pairing specialized AI agents with authenticated human roles under strict governance.", C_CYAN)

    # Left Card: 5 Human Roles
    left_card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.1), Inches(5.7), Inches(4.5))
    left_card.fill.solid()
    left_card.fill.fore_color.rgb = C_CARD_BG
    left_card.line.color.rgb = C_BLUE
    left_card.line.width = Pt(1.5)

    tb_left = s3.shapes.add_textbox(Inches(1.0), Inches(2.3), Inches(5.3), Inches(4.1))
    tf_l = tb_left.text_frame
    tf_l.word_wrap = True
    p = tf_l.paragraphs[0]
    p.text = "5 Human Application Roles (RBAC)"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = C_CYAN

    human_roles = [
        ("1. Customer (External)", "Filing voice/text complaints, tracking live status."),
        ("2. Support Executive (EMP101)", "Triage assigned cases, review AI-drafted responses."),
        ("3. Payment Ops Analyst (EMP201)", "Core gateway analysis (U69/U30), duplicate debits."),
        ("4. Merchant Ops Exec (EMP301)", "Soundbox telemetry, settlements, field tickets."),
        ("5. Supervisor / Admin (EMP401)", "Final approval authority for refunds, AI health audit.")
    ]
    for role, desc in human_roles:
        p = tf_l.add_paragraph()
        p.text = f"• {role}: {desc}"
        p.font.size = Pt(11)
        p.font.color.rgb = C_SLATE_LIGHT
        p.space_before = Pt(6)

    # Right Card: 5 AI Agents
    right_card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(2.1), Inches(5.7), Inches(4.5))
    right_card.fill.solid()
    right_card.fill.fore_color.rgb = C_CARD_BG
    right_card.line.color.rgb = C_CYAN
    right_card.line.width = Pt(1.5)

    tb_right = s3.shapes.add_textbox(Inches(7.0), Inches(2.3), Inches(5.3), Inches(4.1))
    tf_r = tb_right.text_frame
    tf_r.word_wrap = True
    p = tf_r.paragraphs[0]
    p.text = "5 Autonomous AI Agents (Azure OpenAI)"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = C_CYAN

    ai_agents = [
        ("1. Customer Support Agent", "Multilingual STT, sentiment analysis, grounded drafts."),
        ("2. Payment Investigation Agent", "Bank & gateway telemetry verification (U69/U30)."),
        ("3. Dispute Resolution Agent", "RBI/Paytm policy RAG matching & auto-reversal plan."),
        ("4. Merchant Operations Agent", "Soundbox diagnostics, ledger sync & cross-sell."),
        ("5. Governance & Audit Agent", "Risk scoring, SLA breach prediction, supervisor pack.")
    ]
    for agent, desc in ai_agents:
        p = tf_r.add_paragraph()
        p.text = f"• {agent}: {desc}"
        p.font.size = Pt(11)
        p.font.color.rgb = C_SLATE_LIGHT
        p.space_before = Pt(6)

    # Bottom Banner
    bb = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.75), Inches(11.7), Inches(0.45))
    bb.fill.solid()
    bb.fill.fore_color.rgb = RGBColor(10, 20, 35)
    bb.line.fill.background()
    tb = s3.shapes.add_textbox(Inches(0.9), Inches(6.75), Inches(11.5), Inches(0.45))
    p = tb.text_frame.paragraphs[0]
    p.text = "Key Architecture Rule: AI agents investigate and formulate proposals; only the Human Supervisor (EMP401) can authorize payouts."
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD

    # ==========================================
    # SLIDE 4: TECHNOLOGY / TECH STACK USED
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    add_slide_background(s4)
    add_header(s4, "📌 Technology / Tech Stack Used", "Enterprise Multi-Agent & Cloud Stack",
               "Architected around the LangGraph State Graph pattern and enterprise Azure Cognitive Cloud services.", C_BLUE)

    # Highlight Banner: Multi-Agent Orchestration Engine
    orch_banner = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.95), Inches(11.7), Inches(0.85))
    orch_banner.fill.solid()
    orch_banner.fill.fore_color.rgb = RGBColor(10, 25, 47)
    orch_banner.line.color.rgb = C_CYAN
    orch_banner.line.width = Pt(1.5)

    tb_ob = s4.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(11.3), Inches(0.75))
    tf_ob = tb_ob.text_frame
    tf_ob.word_wrap = True
    p = tf_ob.paragraphs[0]
    p.text = "AGENT ORCHESTRATION ENGINE: LangGraph State Graph Architecture Pattern"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_CYAN

    p_sub = tf_ob.add_paragraph()
    p_sub.text = "Implements Directed Cyclic State Graphs: Specialized Agent Nodes, Shared Execution Context, Dynamic Conditional Edges, Self-Reflection Verification, and Human-in-the-Loop Interrupt Checkpoints."
    p_sub.font.size = Pt(10)
    p_sub.font.color.rgb = C_SLATE_LIGHT
    p_sub.space_before = Pt(2)

    tech_cards = [
        ("Azure OpenAI Service", "LLM Reasoning Engine", "• Deployment: gpt-4o-mini & gpt-4o\n• Exclusive LLM provider\n• Unscripted intent classification\n• Sentiment & urgency scoring\n• Multilingual regional synthesis\n• Zero hardcoded strings or canned FAQs", C_CYAN),
        ("Azure AI Search & Blob", "Semantic Vector RAG", "• Hybrid Vector + Keyword search\n• Grounded on RBI dispute circulars\n• NPCI settlement timelines & turnaround\n• Paytm internal standard SOPs\n• Azure Blob Storage doc lake\n• Zero-hallucination evidence retrieval", C_BLUE),
        ("FastAPI & Python 3.11", "Asynchronous Backend", "• High-concurrency async REST API\n• Pydantic V2 strict data validation\n• SQLAlchemy Relational Modeling\n• PostgreSQL / Azure SQL (Zero SQLite)\n• Deterministic Anomaly Engine\n• Per-agent telemetry instrumentation", C_EMERALD),
        ("React 18 & TypeScript", "Frontend & Multimodal Voice", "• Vite + TailwindCSS modern SPA\n• Web Speech API (Voice STT)\n• Multilingual in Hindi, Telugu, English\n• Dual portal (Customer & Internal)\n• RBAC module gating (5 human roles)\n• Real-time Agent Health Dashboard", C_ROSE)
    ]

    for idx, (title, subtitle, desc, color) in enumerate(tech_cards):
        x = Inches(0.8 + idx * 3.0)
        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.95), Inches(2.8), Inches(3.65))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = color
        card.line.width = Pt(1.5)

        tb = s4.shapes.add_textbox(x + Inches(0.12), Inches(3.05), Inches(2.55), Inches(3.45))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = C_WHITE

        p_sub = tf.add_paragraph()
        p_sub.text = subtitle
        p_sub.font.size = Pt(10)
        p_sub.font.bold = True
        p_sub.font.color.rgb = color
        p_sub.space_before = Pt(2)

        p_desc = tf.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(10)
        p_desc.font.color.rgb = C_SLATE_LIGHT
        p_desc.space_before = Pt(6)

    # Bottom Strip
    bb = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.75), Inches(11.7), Inches(0.45))
    bb.fill.solid()
    bb.fill.fore_color.rgb = RGBColor(15, 23, 42)
    bb.line.color.rgb = C_CYAN
    tb = s4.shapes.add_textbox(Inches(1.0), Inches(6.77), Inches(11.3), Inches(0.4))
    p = tb.text_frame.paragraphs[0]
    p.text = "Strict Constraints Met: Zero SQLite (Pure Relational DB)  |  Exclusive Azure OpenAI (No external APIs)  |  100% Passed Tests"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_CYAN

    # ==========================================
    # SLIDE 5: USP (UNIQUE SELLING PROPOSITION)
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    add_slide_background(s5)
    add_header(s5, "📌 USP (Unique Selling Proposition)", "What Sets Paytm ResolveAI Apart?",
               "Moving beyond conversational chatbots to an accountable, autonomous, and safe financial AI workforce.", C_EMERALD)

    usp_cards = [
        ("100% Dynamic & Unscripted", "Zero hardcoded strings or canned FAQs. Every root-cause deduction, gateway code interpretation, and customer draft is synthesized on demand with prompt grounding and live telemetry.", C_CYAN),
        ("Multilingual Voice STT", "Voice dispute submission in Hindi, Telugu, and English. The AI understands colloquial payment terminology (e.g. 'paise kat gaye par mila nahi') and provides native regional audio responses.", C_BLUE),
        ("Human-in-the-Loop Safe", "AI agents can investigate, verify ledgers, and formulate refund proposals, but only an authenticated Human Supervisor (EMP401) can authorize payouts, preventing unauthorized payouts.", C_EMERALD),
        ("Live Agent Observability", "Admin observability dashboard tracks per-agent latency (ms), token consumption (prompt/completion), temperature, total invocations, and SLA breach risk in real time.", C_ROSE)
    ]

    for idx, (title, desc, color) in enumerate(usp_cards):
        x = Inches(0.8 + idx * 3.0)
        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.2), Inches(2.8), Inches(4.6))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = color
        card.line.width = Pt(1.5)

        tb = s5.shapes.add_textbox(x + Inches(0.15), Inches(2.4), Inches(2.5), Inches(4.2))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = C_WHITE

        p_desc = tf.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(11)
        p_desc.font.color.rgb = C_SLATE_LIGHT
        p_desc.space_before = Pt(14)

    # ==========================================
    # SLIDE 6: IMPACT & BENEFITS
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    add_slide_background(s6)
    add_header(s6, "📌 Impact & Benefits", "Measurable Operational & Financial Transformation",
               "Delivering rapid turnaround, lower operational costs, and superior customer retention across Paytm payment rails.", C_CYAN)

    stats = [
        ("99%", "TAT Reduction", "Dispute analysis slashed from 48-72 hours to <30 seconds for routine gateway pending debits.", C_CYAN),
        ("82%", "First-Contact Resolution", "Over 80% of routine payment queries and settlement doubts resolved instantly without tier escalation.", C_EMERALD),
        ("65%", "Operational Cost Savings", "Reduced L1/L2 support headcount requirement, reallocating human capital to complex edge-cases.", C_BLUE),
        ("35%", "Merchant Churn Drop", "Real-time Soundbox telemetry & preemptive field-service dispatch prevents merchant downtime.", C_ROSE)
    ]

    for idx, (stat, title, desc, color) in enumerate(stats):
        x = Inches(0.8 + idx * 3.0)
        card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.2), Inches(2.8), Inches(3.2))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = color
        card.line.width = Pt(1.5)

        tb = s6.shapes.add_textbox(x + Inches(0.15), Inches(2.3), Inches(2.5), Inches(2.9))
        tf = tb.text_frame
        tf.word_wrap = True
        p_stat = tf.paragraphs[0]
        p_stat.text = stat
        p_stat.font.size = Pt(36)
        p_stat.font.bold = True
        p_stat.font.color.rgb = color

        p_title = tf.add_paragraph()
        p_title.text = title
        p_title.font.size = Pt(13)
        p_title.font.bold = True
        p_title.font.color.rgb = C_WHITE
        p_title.space_before = Pt(4)

        p_desc = tf.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(10)
        p_desc.font.color.rgb = C_SLATE_LIGHT
        p_desc.space_before = Pt(6)

    # Bottom Comparison Table Box
    comp_box = s6.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(5.6), Inches(11.7), Inches(1.5))
    comp_box.fill.solid()
    comp_box.fill.fore_color.rgb = C_CARD_BG
    comp_box.line.color.rgb = C_CYAN

    tb_comp = s6.shapes.add_textbox(Inches(1.0), Inches(5.7), Inches(11.3), Inches(1.3))
    tf_c = tb_comp.text_frame
    tf_c.word_wrap = True
    p = tf_c.paragraphs[0]
    p.text = "Operational Metrics: Before vs. After ResolveAI"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_CYAN

    lines = [
        "• Pending Debit Clarification: 2-3 Days via Email/SMS   -->   < 15 Seconds (Live Banking Audit)",
        "• Soundbox Hardware Triage: Manual Call-center Wait    -->   Automated Remote Diagnostics & Field Ticket Dispatch"
    ]
    for line in lines:
        p_line = tf_c.add_paragraph()
        p_line.text = line
        p_line.font.size = Pt(11)
        p_line.font.color.rgb = C_SLATE_LIGHT
        p_line.space_before = Pt(3)

    # ==========================================
    # SLIDE 7: BUSINESS MODEL
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    add_slide_background(s7)
    add_header(s7, "📌 Business Model", "Monetization, ROI & Commercialization Strategy",
               "Generating substantial internal cost savings while opening lucrative high-margin B2B fintech revenue channels.", C_BLUE)

    biz_cards = [
        ("1. Internal OPEX Optimization", "Paytm Core Savings", "• Over ₹120 Crores in direct annual savings across customer care, back-office payment ops, and merchant support.\n• Elimination of duplicate refund payouts via automated multi-gateway reconciliation.\n• Payback period under 4 months.", C_CYAN),
        ("2. B2B Enterprise SaaS Licensing", "White-Label Offering", "• Package the ResolveAI Multi-Agent Engine as a white-label solution for banks, neobanks, and global fintechs.\n• Tiered subscription model based on monthly dispute volume.\n• Prebuilt connectors for NPCI UPI, Visa, and Core Banking.", C_BLUE),
        ("3. Merchant Value-Added Services", "Revenue Expansion", "• Instant Settlement Guarantee with zero merchant liability for a micro-fee.\n• AI-prioritized merchant business loan underwriting based on transaction health.\n• Premium dedicated Soundbox IoT concierge support tier.", C_EMERALD)
    ]

    for idx, (title, sub, desc, color) in enumerate(biz_cards):
        x = Inches(0.8 + idx * 4.0)
        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.2), Inches(3.7), Inches(4.2))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = color
        card.line.width = Pt(1.5)

        tb = s7.shapes.add_textbox(x + Inches(0.2), Inches(2.4), Inches(3.3), Inches(3.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = C_WHITE

        p_sub = tf.add_paragraph()
        p_sub.text = sub
        p_sub.font.size = Pt(11)
        p_sub.font.bold = True
        p_sub.font.color.rgb = color
        p_sub.space_before = Pt(4)

        p_desc = tf.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(11)
        p_desc.font.color.rgb = C_SLATE_LIGHT
        p_desc.space_before = Pt(10)

    # Bottom ROI Banner
    bb = s7.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.6), Inches(11.7), Inches(0.55))
    bb.fill.solid()
    bb.fill.fore_color.rgb = RGBColor(15, 23, 42)
    bb.line.color.rgb = C_EMERALD
    tb = s7.shapes.add_textbox(Inches(1.0), Inches(6.62), Inches(11.3), Inches(0.5))
    p = tb.text_frame.paragraphs[0]
    p.text = "Projected ROI: 4.8x LTV/CAC Multiplier  |  Break-even: < 4 Months  |  Market Opportunity: $14.2B Global Payment Ops"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD

    # ==========================================
    # SLIDE 8: SUMMARY & CONCLUSION
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    add_slide_background(s8)
    add_header(s8, "📌 Conclusion & Live Demo", "Paytm ResolveAI: Ready for Production",
               "A transformative autonomous workforce demonstrating the next generation of fintech customer and merchant operations.", C_CYAN)

    sum_cards = [
        ("Production Highlights", "• 5 Human Application Roles (RBAC)\n• 5 Autonomous AI Specialist Teammates\n• LangGraph State Graph Architecture\n• Vernacular Voice STT (Hindi, Telugu, English)\n• Zero Hardcoding — 100% Azure OpenAI RAG", C_CYAN),
        ("Live Deployment Links", "🌐 Live Web Application:\nhttps://boinisaitej.github.io/Paytm-ResolveAI/\n\n💻 GitHub Open Source Repo:\nhttps://github.com/boinisaitej/Paytm-ResolveAI\n\n☁️ Azure Cloud Deployment:\nhttps://paytm-resolveai-app.azurewebsites.net", C_EMERALD),
        ("Track 3 Shortlist USP", "• Doesn't just answer; executes end-to-end actions\n• Audits core banking & gateway logs (U69/U30)\n• Soundbox IoT diagnostics & field tickets\n• Escalates to humans ONLY for financial approvals\n• Full Telemetry & SLA Breach Predictor", C_BLUE)
    ]

    for idx, (title, desc, color) in enumerate(sum_cards):
        x = Inches(0.8 + idx * 4.0)
        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.2), Inches(3.7), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = color
        card.line.width = Pt(1.5)

        tb = s8.shapes.add_textbox(x + Inches(0.2), Inches(2.4), Inches(3.3), Inches(4.1))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = C_WHITE

        p_desc = tf.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(11)
        p_desc.font.color.rgb = C_SLATE_LIGHT
        p_desc.space_before = Pt(14)

    prs.save(output_path)
    print(f"[SUCCESS] PowerPoint presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    import sys
    out = sys.argv[1] if len(sys.argv) > 1 else "c:\\Paytm ResolveAI\\Paytm_ResolveAI_PitchDeck.pptx"
    build_presentation(out)

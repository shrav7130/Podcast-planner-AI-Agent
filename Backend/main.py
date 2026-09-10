from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas 
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware
from agent import generate_podcast_plan
from agent import generate_podcast_plan, generate_suggestions

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Podcast Planner AI Agent is running!"}

@app.get("/plan")
def plan_podcast(guest_name: str, topic: str, tone: str = "Professional/Informative"):
    try:
        plan = generate_podcast_plan(guest_name, topic,tone)
        return {"podcast_plan": plan}
    except Exception as e:
       
        print(" ERROR in /plan:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/suggestions/")
async def get_suggestions(guest_name: str, topic: str):
    try:
        suggestions = generate_suggestions(guest_name, topic)
        return {"suggestions": suggestions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-pdf/")
def generate_pdf(content: str = Body(..., embed=True)):
    try:
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer, pagesize=letter,
            rightMargin=50, leftMargin=50,
            topMargin=50, bottomMargin=50
        )

        styles = getSampleStyleSheet()
        normal_style = styles['Normal']
        heading_style = ParagraphStyle('Heading', parent=styles['Heading2'], spaceAfter=10)
        subheading_style = ParagraphStyle('SubHeading', parent=styles['Heading3'], spaceAfter=8)
        story = []

        lines = content.split("\n")
        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Convert Markdown headers
            if line.startswith("###"):
                story.append(Paragraph(f"<b>{line[3:].strip()}</b>", subheading_style))
            elif line.startswith("##"):
                story.append(Paragraph(f"<b>{line[2:].strip()}</b>", heading_style))
            elif line.startswith("#"):
                story.append(Paragraph(f"<b>{line[1:].strip()}</b>", heading_style))
            # Numbered list
            elif line[:2].isdigit() and line[2] == ".":
                story.append(Paragraph(line, normal_style))
            # Bullets
            elif line.startswith("- ") or line.startswith("* "):
                story.append(Paragraph(line.replace("- ", "• ").replace("* ", "• "), normal_style))
            # Normal paragraph
            else:
                story.append(Paragraph(line, normal_style))

            story.append(Spacer(1, 6))  # space between lines

        doc.build(story)
        buffer.seek(0)

        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=episode_plan.pdf"}
        )

    except Exception as e:
        print("ERROR in /generate-pdf:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
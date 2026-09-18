from pydantic import BaseModel, Field


class Experience(BaseModel):
    company: str = ""
    role: str = ""
    duration: str = ""
    description: str = ""
    skills_used: list[str] = Field(default_factory=list)


class Project(BaseModel):
    name: str = ""
    description: str = ""
    technologies: list[str] = Field(default_factory=list)
    features: list[str] = Field(default_factory=list)
    role: str = ""


class Portfolio(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    role: str = ""
    summary: str = ""

    skills: list[str] = Field(default_factory=list)

    experience: list[Experience] = Field(
        default_factory=list
    )

    projects: list[Project] = Field(
        default_factory=list
    )

    education: list[str] = Field(
        default_factory=list
    )

    certifications: list[str] = Field(
        default_factory=list
    )

class Source(BaseModel):
    title: str
    url: str


class UIAction(BaseModel):
    type: str = "none"
    target: str | None = None


class AIResponse(BaseModel):
    answer: str
    intent: str = "general"

    suggested_questions: list[str] = Field(
        default_factory=list
    )

    related_projects: list[str] = Field(
        default_factory=list
    )

    sources: list[Source] = Field(
        default_factory=list
    )

    ui_action: UIAction | None = None


class JDEvidence(BaseModel):
    requirement: str
    status: str = "not_documented"
    explanation: str = ""
    projects: list[str] = Field(default_factory=list)
    evidence: list[str] = Field(default_factory=list)
    sources: list[Source] = Field(default_factory=list)


class JDAnalysis(BaseModel):
    role: str = ""
    company: str = ""

    summary: str = ""

    demonstrated: list[JDEvidence] = Field(
        default_factory=list
    )

    partially_demonstrated: list[JDEvidence] = Field(
        default_factory=list
    )

    not_documented: list[JDEvidence] = Field(
        default_factory=list
    )

    relevant_projects: list[str] = Field(
        default_factory=list
    )

    interview_focus: list[str] = Field(
        default_factory=list
    )
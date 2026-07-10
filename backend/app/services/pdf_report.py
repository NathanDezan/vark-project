from __future__ import annotations

from datetime import datetime, timezone
from io import BytesIO
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Flowable, ListFlowable, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

from app.schemas.result import ModalityGuide, ResultPayload, ScoreBreakdown
from app.services.scoring import MODALITY_NAMES, load_guides_for_modalities, learning_profile

MAX_SCORE = 16

THEME = {
    "V": {"hex": "#6366f1", "color": colors.HexColor("#6366f1")},
    "A": {"hex": "#10b981", "color": colors.HexColor("#10b981")},
    "R": {"hex": "#f59e0b", "color": colors.HexColor("#f59e0b")},
    "K": {"hex": "#ec4899", "color": colors.HexColor("#ec4899")},
}


class ScoreBar(Flowable):
    def __init__(self, value: int, fill_color: colors.Color, width: float, height: float = 9):
        super().__init__()
        self.value = value
        self.fill_color = fill_color
        self.width = width
        self.height = height

    def wrap(self, availWidth: float, availHeight: float) -> tuple[float, float]:
        return self.width, self.height

    def draw(self) -> None:
        radius = self.height / 2
        fill_width = 0
        if self.value > 0:
            fill_width = max(self.height, (self.width * min(self.value, MAX_SCORE)) / MAX_SCORE)

        self.canv.saveState()
        self.canv.setFillColor(colors.HexColor("#e2e8f0"))
        self.canv.roundRect(0, 0, self.width, self.height, radius, fill=1, stroke=0)
        if fill_width:
            self.canv.setFillColor(self.fill_color)
            self.canv.roundRect(0, 0, fill_width, self.height, radius, fill=1, stroke=0)
        self.canv.restoreState()


def _safe_text(value: str) -> str:
    return escape(value).replace("\n", "<br/>")


def _parse_created_at(value: str) -> datetime:
    normalized = value[:-1] + "+00:00" if value.endswith("Z") else value
    try:
        return datetime.fromisoformat(normalized)
    except ValueError:
        return datetime.now(timezone.utc)


def _format_created_at(value: str) -> str:
    return _parse_created_at(value).astimezone(timezone.utc).strftime("%d/%m/%Y %H:%M UTC")


def _styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "ResultTitle",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=26,
            textColor=colors.HexColor("#0f172a"),
            alignment=TA_LEFT,
            spaceAfter=4,
        ),
        "subtitle": ParagraphStyle(
            "ResultSubtitle",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#64748b"),
            spaceAfter=10,
        ),
        "section": ParagraphStyle(
            "ResultSection",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=18,
            textColor=colors.HexColor("#0f172a"),
            spaceBefore=4,
            spaceAfter=8,
        ),
        "body": ParagraphStyle(
            "ResultBody",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#334155"),
        ),
        "small": ParagraphStyle(
            "ResultSmall",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor("#64748b"),
        ),
        "profile": ParagraphStyle(
            "ResultProfile",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=24,
            textColor=colors.HexColor("#111827"),
        ),
        "guideTitle": ParagraphStyle(
            "GuideTitle",
            parent=base["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=15,
            textColor=colors.HexColor("#0f172a"),
            spaceAfter=4,
        ),
        "guideSubtitle": ParagraphStyle(
            "GuideSubtitle",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=11,
            textColor=colors.HexColor("#64748b"),
            spaceBefore=3,
            spaceAfter=3,
        ),
    }


def _score_value(scores: ScoreBreakdown, code: str) -> int:
    return getattr(scores, code)


def _summary_text(modality_count: int) -> str:
    if modality_count > 1:
        return (
            "O seu resultado mostra mais de uma modalidade dominante, formando um perfil "
            "multimodal. Use essa combinação para alternar recursos de estudo, revisão e "
            "apresentação do conteúdo."
        )
    return (
        "Você tem uma modalidade dominante bem definida. Use isso para ajustar a forma "
        "como estuda, revisa e apresenta informações."
    )


def _profile_box(
    result: ResultPayload,
    profile: str,
    winners: list[str],
    width: float,
    styles: dict[str, ParagraphStyle],
) -> Table:
    top_score = max(_score_value(result.scores, code) for code in ["V", "A", "R", "K"])
    content = [
        Paragraph("Seu perfil VARK", styles["small"]),
        Spacer(1, 4),
        Paragraph(_safe_text(profile), styles["profile"]),
        Spacer(1, 4),
        Paragraph(_safe_text(_summary_text(len(winners))), styles["body"]),
        Spacer(1, 8),
        Paragraph(f"<b>Pontuação máxima:</b> {top_score} / {MAX_SCORE}", styles["body"]),
    ]

    table = Table([[content]], colWidths=[width], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#e2e8f0")),
                ("LINEABOVE", (0, 0), (-1, 0), 3, colors.HexColor("#6366f1")),
                ("LEFTPADDING", (0, 0), (-1, -1), 14),
                ("RIGHTPADDING", (0, 0), (-1, -1), 14),
                ("TOPPADDING", (0, 0), (-1, -1), 12),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
            ]
        )
    )
    return table


def _score_table(
    result: ResultPayload,
    width: float,
    styles: dict[str, ParagraphStyle],
) -> Table:
    points_col = max(62, width * 0.17)
    distribution_col = max(150, width - 130 - points_col)
    bar_width = max(120, distribution_col - 18)
    rows = [[
        Paragraph("<b>Modalidade</b>", styles["body"]),
        Paragraph("<b>Pontos</b>", styles["body"]),
        Paragraph("<b>Distribuição</b>", styles["body"]),
    ]]

    for code in ["V", "A", "R", "K"]:
        score = _score_value(result.scores, code)
        rows.append(
            [
                Paragraph(
                    f'<font color="{THEME[code]["hex"]}"><b>{_safe_text(MODALITY_NAMES[code])}</b></font>',
                    styles["body"],
                ),
                Paragraph(f"<b>{score}</b>", styles["body"]),
                ScoreBar(score, THEME[code]["color"], width=bar_width),
            ]
        )

    table = Table(rows, colWidths=[130, points_col, distribution_col], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f8fafc")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 9.5),
                ("LEADING", (0, 0), (-1, -1), 12),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#e2e8f0")),
                ("INNERGRID", (0, 0), (-1, -1), 0.6, colors.HexColor("#e2e8f0")),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )
    return table


def _guide_card(guide: ModalityGuide, width: float, styles: dict[str, ParagraphStyle]) -> Table:
    theme = THEME[guide.code]
    bullets = ListFlowable(
        [Paragraph(_safe_text(strategy), styles["body"]) for strategy in guide.strategies],
        bulletType="bullet",
        start="circle",
        leftIndent=14,
        bulletFontName="Helvetica",
        bulletFontSize=8,
        bulletOffsetY=2,
    )

    content = [
        Paragraph(
            f'<font color="{theme["hex"]}"><b>{_safe_text(guide.name)}</b></font>',
            styles["guideTitle"],
        ),
        Paragraph(_safe_text(guide.description), styles["body"]),
        Spacer(1, 4),
        Paragraph("Estratégias práticas", styles["guideSubtitle"]),
        bullets,
    ]

    table = Table([[content]], colWidths=[width], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#e2e8f0")),
                ("LINELEFT", (0, 0), (0, 0), 4, theme["color"]),
                ("LEFTPADDING", (0, 0), (-1, -1), 14),
                ("RIGHTPADDING", (0, 0), (-1, -1), 14),
                ("TOPPADDING", (0, 0), (-1, -1), 12),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
            ]
        )
    )
    return table


def build_result_pdf(result: ResultPayload) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title="Resultado VARK",
        author="VARK",
        subject="Relatório de resultado do questionário VARK",
        creator="VARK Backend",
    )

    styles = _styles()
    profile, winners = learning_profile(result.scores)
    guides = load_guides_for_modalities(winners)
    width = doc.width

    story: list[object] = [
        _profile_box(result, profile, winners, width, styles),
        Spacer(1, 12),
        Paragraph("Pontuação por modalidade", styles["section"]),
        Paragraph(
            "A pontuação vai de 0 a 16 pontos e mostra como as respostas se distribuíram entre as modalidades.",
            styles["body"],
        ),
        Spacer(1, 8),
        _score_table(result, width, styles),
        Spacer(1, 12),
        Paragraph("Resumo interpretativo", styles["section"]),
        Paragraph(_safe_text(_summary_text(len(winners))), styles["body"]),
        Spacer(1, 12),
        Paragraph("Guia de estudo personalizado", styles["section"]),
    ]

    for index, guide in enumerate(guides):
        story.append(_guide_card(guide, width, styles))
        if index < len(guides) - 1:
            story.append(Spacer(1, 8))

    def _decorate(canvas, doc_obj) -> None:
        canvas.saveState()
        canvas.restoreState()

    doc.build(story, onFirstPage=_decorate, onLaterPages=_decorate)
    return buffer.getvalue()

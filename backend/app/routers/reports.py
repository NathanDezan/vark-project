from __future__ import annotations

from fastapi import APIRouter
from fastapi.responses import Response

from app.schemas.result import ResultPayload
from app.services.pdf_report import build_result_pdf

router = APIRouter(prefix="/svc/api", tags=["reports"])


@router.post("/result/pdf")
def export_result_pdf(payload: ResultPayload) -> Response:
    pdf_bytes = build_result_pdf(payload)
    filename = f"resultado-vark-{payload.id}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "X-Content-Type-Options": "nosniff",
        },
    )

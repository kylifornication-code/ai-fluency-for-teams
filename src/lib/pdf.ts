import { jsPDF } from "jspdf";
import type {
  FluencyTable,
  FluencyLevel,
  TeamAssessment,
} from "@/types";

const LEVEL_COLORS: Record<string, [number, number, number]> = {
  Unskilled: [239, 68, 68],
  Capable: [245, 158, 11],
  Adoptive: [59, 130, 246],
  Transformative: [99, 102, 241],
};

const PAGE = {
  width: 595.28,
  height: 841.89,
  margin: 48,
};
const CONTENT_WIDTH = PAGE.width - PAGE.margin * 2;

const COLORS = {
  text: [15, 23, 42] as [number, number, number],
  muted: [100, 116, 139] as [number, number, number],
  rule: [226, 232, 240] as [number, number, number],
  card: [248, 250, 252] as [number, number, number],
  cardBorder: [226, 232, 240] as [number, number, number],
};

function formatRole(roleId: string): string {
  return roleId
    .replace(/-/g, " ")
    .split(" ")
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

class PdfWriter {
  doc: jsPDF;
  y: number;

  constructor() {
    this.doc = new jsPDF({ unit: "pt", format: "a4" });
    this.y = PAGE.margin;
  }

  ensureSpace(needed: number) {
    if (this.y + needed > PAGE.height - PAGE.margin) {
      this.doc.addPage();
      this.y = PAGE.margin;
    }
  }

  newPage() {
    this.doc.addPage();
    this.y = PAGE.margin;
  }

  setColor(rgb: [number, number, number]) {
    this.doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  }

  heading(text: string) {
    this.ensureSpace(28);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(20);
    this.setColor(COLORS.text);
    this.doc.text(text, PAGE.margin, this.y);
    this.y += 24;
  }

  subheading(text: string) {
    this.ensureSpace(18);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(11);
    this.setColor(COLORS.muted);
    this.doc.text(text, PAGE.margin, this.y);
    this.y += 18;
  }

  sectionTitle(text: string, color?: [number, number, number]) {
    this.ensureSpace(20);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(13);
    this.setColor(color ?? COLORS.text);
    this.doc.text(text, PAGE.margin, this.y);
    this.y += 18;
  }

  rule() {
    this.ensureSpace(8);
    this.doc.setDrawColor(
      COLORS.rule[0],
      COLORS.rule[1],
      COLORS.rule[2]
    );
    this.doc.setLineWidth(0.5);
    this.doc.line(
      PAGE.margin,
      this.y,
      PAGE.width - PAGE.margin,
      this.y
    );
    this.y += 10;
  }

  gap(h = 8) {
    this.y += h;
  }

  paragraph(text: string, opts?: { size?: number; bold?: boolean }) {
    const size = opts?.size ?? 10;
    this.doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
    this.doc.setFontSize(size);
    this.setColor(COLORS.text);
    const lines = this.doc.splitTextToSize(text, CONTENT_WIDTH) as string[];
    const lineHeight = size * 1.35;
    for (const line of lines) {
      this.ensureSpace(lineHeight);
      this.doc.text(line, PAGE.margin, this.y);
      this.y += lineHeight;
    }
  }

  bullet(text: string, indent = 14) {
    const size = 10;
    const lineHeight = size * 1.4;
    const width = CONTENT_WIDTH - indent;
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(size);
    this.setColor(COLORS.text);
    const lines = this.doc.splitTextToSize(text, width) as string[];
    this.ensureSpace(lineHeight * lines.length);
    this.doc.text("•", PAGE.margin, this.y);
    for (const [i, line] of lines.entries()) {
      if (i > 0) this.ensureSpace(lineHeight);
      this.doc.text(line, PAGE.margin + indent, this.y);
      this.y += lineHeight;
    }
  }

  chipRow(items: string[]) {
    if (items.length === 0) return;
    const size = 9;
    const padX = 6;
    const padY = 4;
    const gap = 4;
    const lineHeight = size + padY * 2 + gap;
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(size);

    let x = PAGE.margin;
    this.ensureSpace(lineHeight);

    for (const item of items) {
      const w = this.doc.getTextWidth(item) + padX * 2;
      if (x + w > PAGE.width - PAGE.margin) {
        this.y += lineHeight;
        this.ensureSpace(lineHeight);
        x = PAGE.margin;
      }
      this.doc.setDrawColor(
        COLORS.cardBorder[0],
        COLORS.cardBorder[1],
        COLORS.cardBorder[2]
      );
      this.doc.setFillColor(
        COLORS.card[0],
        COLORS.card[1],
        COLORS.card[2]
      );
      this.doc.roundedRect(x, this.y - size, w, size + padY * 2, 3, 3, "FD");
      this.setColor(COLORS.text);
      this.doc.text(item, x + padX, this.y + padY);
      x += w + gap;
    }
    this.y += lineHeight;
  }

  levelBadge(level: string) {
    const color = LEVEL_COLORS[level] ?? [100, 116, 139];
    const size = 10;
    const padX = 8;
    const padY = 5;
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(size);
    const w = this.doc.getTextWidth(level) + padX * 2;
    const h = size + padY * 2;
    this.ensureSpace(h + 6);
    this.doc.setFillColor(color[0], color[1], color[2]);
    this.doc.roundedRect(PAGE.margin, this.y - size, w, h, 4, 4, "F");
    this.doc.setTextColor(255, 255, 255);
    this.doc.text(level, PAGE.margin + padX, this.y + padY);
    this.y += h + 6;
  }

  save(filename: string) {
    this.doc.save(filename);
  }
}

function renderFluencyLevel(w: PdfWriter, level: FluencyLevel) {
  w.levelBadge(level.level);

  if (level.criteria.length > 0) {
    w.sectionTitle("Criteria");
    for (const c of level.criteria) w.bullet(c);
    w.gap(4);
  }

  if (level.examples.length > 0) {
    w.sectionTitle("Examples");
    for (const e of level.examples) w.bullet(e);
    w.gap(4);
  }

  if (level.tools.length > 0) {
    w.sectionTitle("Tools");
    w.chipRow(level.tools);
    w.gap(2);
  }

  if (level.skills.length > 0) {
    w.sectionTitle("Skills");
    w.chipRow(level.skills);
    w.gap(2);
  }

  w.gap(6);
  w.rule();
  w.gap(6);
}

function renderFluencyHeader(w: PdfWriter, data: FluencyTable) {
  w.heading("AI Fluency Assessment");
  w.subheading(
    `${formatRole(data.roleId)} · ${data.industry} · Generated ${formatDate(data.generatedAt)}`
  );
  w.rule();
  w.gap(6);
}

export function exportFluencyTableToPdf(data: FluencyTable) {
  const w = new PdfWriter();
  renderFluencyHeader(w, data);
  for (const level of data.levels) {
    renderFluencyLevel(w, level);
  }
  const filename = `ai-fluency-${slugify(formatRole(data.roleId))}-${slugify(data.industry)}.pdf`;
  w.save(filename);
}

export function exportTeamAssessmentToPdf(
  data: TeamAssessment,
  selections: Record<string, string | null>
) {
  const w = new PdfWriter();

  w.heading("Team AI Fluency Assessment");
  w.subheading(
    `${data.results.length} role${data.results.length !== 1 ? "s" : ""} · ${data.industry} · Generated ${formatDate(data.generatedAt)}`
  );
  w.rule();
  w.gap(6);

  const assessed = data.results.filter((r) => selections[r.member.id]);
  const counts: Record<string, number> = {};
  for (const r of assessed) {
    const lvl = selections[r.member.id];
    if (lvl) counts[lvl] = (counts[lvl] ?? 0) + 1;
  }

  w.sectionTitle("Team Distribution");
  w.paragraph(
    `${assessed.length} of ${data.results.length} team member${data.results.length !== 1 ? "s" : ""} assessed`,
    { size: 10 }
  );
  w.gap(4);
  for (const lvl of ["Unskilled", "Capable", "Adoptive", "Transformative"]) {
    const count = counts[lvl] ?? 0;
    if (count === 0) continue;
    w.paragraph(`${lvl}: ${count}`, { bold: true });
  }
  w.gap(8);
  w.rule();
  w.gap(6);

  w.sectionTitle("Team Members");
  for (const result of data.results) {
    const selected = selections[result.member.id];
    w.ensureSpace(30);
    w.paragraph(result.member.name, { bold: true, size: 12 });
    const meta = selected
      ? `${result.member.roleTitle} — ${selected}`
      : result.member.roleTitle;
    w.paragraph(meta, { size: 10 });
    w.gap(6);
  }

  if (data.failures && data.failures.length > 0) {
    w.gap(6);
    w.rule();
    w.gap(6);
    w.sectionTitle("Assessments not generated");
    for (const f of data.failures) {
      w.bullet(`${f.member.name} (${f.member.roleTitle}) — ${f.error}`);
    }
  }

  for (const result of data.results) {
    w.newPage();
    w.heading(result.member.name);
    w.subheading(
      `${result.member.roleTitle}${
        selections[result.member.id]
          ? ` · Assessed as ${selections[result.member.id]}`
          : ""
      }`
    );
    w.rule();
    w.gap(6);
    for (const level of result.assessment.levels) {
      renderFluencyLevel(w, level);
    }
  }

  const filename = `team-ai-fluency-${slugify(data.industry)}.pdf`;
  w.save(filename);
}

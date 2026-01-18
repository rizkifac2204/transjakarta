import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

// Helper function to convert array of objects to CSV string
function convertToCSV(data, questions) {
  if (data.length === 0) {
    return "";
  }

  // Create header rows
  const questionHeaders = questions.flatMap((q) => [
    q.spm_criteria,
    `${q.spm_criteria} (Catatan) તરીકે`,
  ]);
  const staticHeaders = [
    "No",
    "Time Stamp",
    "Unit Kerja",
    "Hari/Tanggal",
    "Waktu Survey",
    "KodeTrayek",
    "Asal - Tujuan",
    "No.Body",
    "Jenis Layanan",
    "Tipe Armada",
  ];
  const header = [...staticHeaders, ...questionHeaders];

  // Create section headers (like in the example) by mapping questions to sections
  const sectionMap = new Map();
  questions.forEach((q) => {
    if (!sectionMap.has(q.section)) {
      sectionMap.set(q.section, 0);
    }
    sectionMap.set(q.section, sectionMap.get(q.section) + 2); // 2 columns per question (answer + note)
  });

  let sectionHeader = [
    "IDENTITAS ARMADA",
    ";".repeat(staticHeaders.length - 1),
  ];
  for (const [section, count] of sectionMap.entries()) {
    sectionHeader.push(section + ";".repeat(count > 0 ? count - 1 : 0));
  }

  const csvRows = [sectionHeader.join(";"), header.join(";")];

  // Create data rows
  data.forEach((survey, index) => {
    const staticValues = [
      index + 1,
      survey.jam_mulai
        ? new Date(survey.jam_mulai).toLocaleTimeString("id-ID")
        : "",
      survey.surveyor.nama,
      survey.tanggal
        ? new Date(survey.tanggal).toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",
      survey.periode,
      survey.kode_trayek,
      survey.asal_tujuan,
      survey.no_body,
      survey.service_type.name,
      survey.fleet_type.name,
    ];

    const answerMap = new Map(
      survey.answers.map((ans) => [ans.question_id, ans]),
    );

    const questionValues = questions.flatMap((q) => {
      const answer = answerMap.get(q.id);
      const value = answer ? (answer.answer ? "Ya" : "Tidak") : "";
      const note = answer ? answer.note || "" : "";
      return [value, note];
    });

    const row = [...staticValues, ...questionValues].map((value) => {
      const stringValue = String(value);
      // Escape quotes by doubling them and wrap in quotes if it contains separator, newline or quote
      if (
        stringValue.includes('"') ||
        stringValue.includes(";") ||
        stringValue.includes("\n")
      ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csvRows.push(row.join(";"));
  });

  return csvRows.join("\n");
}

export async function GET(request) {
  try {
    // 1. Fetch all questions to build the headers dynamically
    const allQuestions = await prisma.armada_question.findMany({
      orderBy: {
        order: "asc", // Assuming you have an 'order' field
      },
    });

    // 2. Fetch all surveys with their related data
    const surveys = await prisma.armada_survey.findMany({
      where: {
        finish: true, // Only include finished surveys
      },
      include: {
        surveyor: true, // To get surveyor's name
        service_type: true, // To get service type name
        fleet_type: true, // To get fleet type name
        answers: {
          include: {
            question: true, // Include question details in each answer
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // 3. Convert data to CSV format
    const csvData = convertToCSV(surveys, allQuestions);

    // 4. Return the CSV as a response
    return new NextResponse(csvData, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="tabulasi-armada.csv"',
      },
    });
  } catch (error) {
    console.error("Failed to export armada surveys:", error);
    return NextResponse.json(
      { error: "Gagal mengekspor data survei armada." },
      { status: 500 },
    );
  }
}

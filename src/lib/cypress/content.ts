import type { Locale } from "./types";

export interface CypressContent {
  hero: { eyebrow: string; title: string; body: string };
  cta: { start: string; howTo: string };
  trust: { localTitle: string; storageTitle: string; storageBody: string; opennessTitle: string };
  howto: {
    kakaoTitle: string;
    kakaoSteps: string[];
    naverTitle: string;
    naverSteps: string[];
  };
  dropzone: {
    main: string;
    sub: string;
    privacyNote: string;
    chooseFiles: string;
    clearFiles: string;
    clearSlot: string;
    ready: string;
    empty: string;
    filesReady: (count: number) => string;
    slotEmpty: string;
    kakaoExpected: string;
    naverExpected: string;
    otherFiles: string;
  };
  formats: { kakaoTitle: string; kakaoDesc: string; naverTitle: string; naverDesc: string; unsupportedNote: string };
  preStart: { title: string; body: string; legalNote: string; privacyLink: string };
  progress: { reading: string; parsing: string; scoring: string; done: string };
  errors: {
    harUnrecognized: string;
    fileTypeUnrecognized: string;
    fileTooLarge: string;
    kakaoThirdPartyRequired: string;
    naverHarRequired: string;
  };
  disclaimer: { snapshot: string; scoreMeaning: string };
  tabs: {
    naver: string;
    kakao: string;
    kakaoCollect: string;
    kakaoCollectExtra: string;
    kakaoProvider: string;
    generic: string;
  };
  summary: {
    serviceCount: string;
    sensitiveCount: string;
    comparableTag: string;
    platformOnlyTag: string;
    noScoreNote: string;
  };
  toolbar: { searchPlaceholder: string; sortButton: string; clearCategoryFilter: string };
  methodology: { summary: string; intro: string };
  rows: {
    whyScore: (count: number, hasStale: boolean) => string;
    comboNote: string;
    staleNote: (days: number) => string;
    cleanupBadge: (days: number) => string;
    emptyResult: string;
  };
  report: {
    button: string;
    print: string;
    close: string;
    title: string;
    generatedAt: (date: string) => string;
    overview: string;
    tableHead: { tab: string; serviceCount: string; sensitiveCount: string };
    topRisk: string;
    topRiskHead: { name: string; tab: string; score: string; items: string };
    cleanup: string;
    cleanupNone: string;
    categories: string;
    categoriesNone: string;
    recommendations: string;
    recHigh: (count: number) => string;
    recCleanup: (count: number) => string;
    recReident: (count: number) => string;
    recFinance: (count: number) => string;
    recSnapshot: string;
    recScoreMeaning: string;
    footNote: string;
  };
  footer: {
    local: string;
    experimental: string;
    privacy: string;
    disclosures: readonly { title: string; body: string }[];
  };
  cleanupReview: {
    cta: string;
    eyebrow: string;
    title: string;
    body: string;
    selectionGuide: string;
    selectedCount: (count: number) => string;
    customOption: string;
    customPlaceholder: string;
    rowCheckboxLabel: (serviceName: string) => string;
    submit: string;
    submitting: string;
    privacyNote: string;
    backToResults: string;
    thanksEyebrow: string;
    thanksTitle: string;
    thanksBody: string;
    returnButton: string;
  };
  deleteFlow: {
    ctaAvailable: string;
    ctaUnavailable: string;
    ctaRequested: string;
    newTabNote: string;
    mailtoFallbackIntro: string;
    copyButton: string;
    copyDone: string;
    mailtoSubject: (serviceName: string) => string;
    mailtoBody: (serviceName: string) => string;
    bulkButton: string;
    bulkModalTitle: string;
    bulkModalBody: string;
    bulkModalEmpty: string;
    bulkModalConfirm: (count: number) => string;
    bulkModalCancel: string;
  };
}

export const CYPRESS_CONTENT: Record<Locale, CypressContent> = {
  ko: {
    hero: {
      eyebrow: "가입한 서비스 살펴보기",
      title: "내 정보가 어디에, 어떻게 공유되었는지 확인해 보세요.",
      body: "복잡했던 시작, 이제는 약 5분이면 충분합니다.\n업로드한 파일은 서버로 전송되지 않으며, 모든 분석은 브라우저 안에서만 이루어집니다. 분석이 끝난 뒤에는 데이터가 저장되지 않으며, 새로고침과 함께 모두 사라집니다.",
    },
    cta: { start: "시작하기 — 파일 업로드", howTo: "파일 준비 방법 보기" },
    trust: {
      localTitle: "로컬 처리",
      storageTitle: "저장 범위",
      storageBody: "업로드한 파일, 파일명, 분석 결과, 자동으로 추출된 전체 서비스 목록은 저장하지 않습니다.",
      opennessTitle: "열린 분석",
    },
    howto: {
      kakaoTitle: "카카오",
      kakaoSteps: [
        "accounts.kakao.com 로그인 → 계정 이용 → 개인정보 이용 현황",
        "\"제3자 제공\" 탭을 클릭한 뒤 Cmd/Ctrl+S로 HTML 저장",
      ],
      naverTitle: "네이버",
      naverSteps: [
        "nid.naver.com에서 연결된 서비스 관리 페이지 접속",
        "개발자도구 Network 탭 → 페이지 새로고침 → 우클릭 → Save all as HAR로 저장",
      ],
    },
    dropzone: {
      main: "파일을 준비해 주세요",
      sub: "카카오와 네이버 파일을 각각 하나씩 올릴 수 있습니다. 새 파일을 올리면 기존 파일은 교체됩니다.",
      privacyNote: "서버로 전송되지 않음 · 이 브라우저 탭 안에서만 처리됨",
      chooseFiles: "파일 선택",
      clearFiles: "파일 해제",
      clearSlot: "해제",
      ready: "READY",
      empty: "EMPTY",
      filesReady: (count) => `${count}개 파일 준비됨`,
      slotEmpty: "파일을 여기에 놓아주세요",
      kakaoExpected: "카카오 제3자 제공 HTML",
      naverExpected: "네이버 연결된 서비스 HAR",
      otherFiles: "OTHER FILES",
    },
    formats: {
      kakaoTitle: "카카오 제3자 제공",
      kakaoDesc: "개인정보 이용 현황에서 제3자 제공 탭을 HTML로 저장한 파일 (.html)",
      naverTitle: "네이버 연결된 서비스",
      naverDesc: "연결된 서비스 관리 페이지를 HAR로 저장한 파일 (.har)",
      unsupportedNote: "지원하지 않는 파일 형식을 업로드하면 인식 실패 안내와 함께 저장 방법을 안내받을 수 있습니다.",
    },
    preStart: {
      title: "시작하기 전에 확인하세요",
      body: "이 도구는 가입·연동 당시 동의한 항목의 스냅샷을 분석합니다. 실시간 수집 내역이 아닐 수 있습니다.",
      legalNote: "분석 결과는 법적 효력이 없으며 참고용 정보입니다.",
      privacyLink: "개인정보 처리방침 확인",
    },
    progress: {
      reading: "파일 읽는 중",
      parsing: "분석하는 중",
      scoring: "위험도 채점 중",
      done: "완료",
    },
    errors: {
      harUnrecognized: "HAR 파일 안에서 연결된 서비스 데이터를 찾지 못했습니다. 연결된 서비스 페이지를 새로고침한 뒤 다시 내보내주세요.",
      fileTypeUnrecognized: "이 파일 형식을 인식하지 못했습니다. 지원 형식(.html/.htm/.json/.har)을 확인해주세요.",
      fileTooLarge: "파일이 너무 큽니다. 10MB 이하의 HTML 또는 HAR 파일을 올려주세요.",
      kakaoThirdPartyRequired: "카카오는 개인정보 이용 현황의 \"제3자 제공\" 탭을 HTML로 저장한 파일만 올려주세요.",
      naverHarRequired: "네이버는 연결된 서비스 관리 페이지에서 저장한 HAR 파일만 올려주세요.",
    },
    disclaimer: {
      snapshot: "이 데이터는 가입/연동 당시 동의한 항목의 스냅샷입니다.",
      scoreMeaning: "점수는 기업 신뢰도가 아니라, 정보가 유출되면 얼마나 심각한가를 뜻합니다.",
    },
    tabs: {
      naver: "네이버 연결된 서비스",
      kakao: "카카오 연결 서비스",
      kakaoCollect: "수집 및 이용",
      kakaoCollectExtra: "수집 및 이용 – 부가 정보(용도 확인 필요)",
      kakaoProvider: "처리 위탁",
      generic: "연결된 서비스 목록",
    },
    summary: {
      serviceCount: "가입/연동된 서비스 수",
      sensitiveCount: "민감정보 보유 서비스 수",
      comparableTag: "외부 제공형 · 다른 플랫폼과 비교 가능",
      platformOnlyTag: "플랫폼 자체 보유형 · 다른 플랫폼과 직접 비교 불가",
      noScoreNote: "이 탭은 항목 단위 데이터가 없어 채점 대상이 아닙니다.",
    },
    toolbar: { searchPlaceholder: "서비스명으로 검색…", sortButton: "위험도 높은 순", clearCategoryFilter: "전체 보기" },
    methodology: {
      summary: "이 위험도 점수는 어떻게 계산되나요 (v1 초안)",
      intro:
        "수집·제공되는 항목 텍스트를 15개 카테고리로 분류하고, 카테고리별 가중치를 합산해 0~100점으로 정규화합니다. 제3자 제공 항목은 1.3배 가중하고, 이름·생년월일·연락처·주소 중 3개 이상이 함께 쓰이면 재식별 위험 보너스를 더합니다. 법적으로 검증된 기준이 아니라 우선순위를 잡기 위한 휴리스틱 초안입니다.",
    },
    rows: {
      whyScore: () => "위험도 점수 해설",
      comboNote: "이름·생년월일·연락처·주소 중 3개 이상이 함께 있어 추가 가산되었습니다.",
      staleNote: (days) => `마지막 이용일로부터 약 ${days}일 지남 — 오래 방치된 연결은 유출·오남용을 알아차리기 어려워 위험도를 가산했습니다.`,
      cleanupBadge: (days) => `정리 후보 · ${days}일 미사용`,
      emptyResult: "결과가 없어요",
    },
    report: {
      button: "요약 리포트 만들기 (A4 1장)",
      print: "인쇄 / PDF로 저장",
      close: "닫기",
      title: "내 정보 노출 현황 리포트",
      generatedAt: (date) => `생성일시: ${date} · 가입한 서비스 살펴보기 v1 (실험적 기능)`,
      overview: "한눈에 보기",
      tableHead: { tab: "탭(플랫폼)", serviceCount: "서비스 수", sensitiveCount: "민감정보 보유(60점+)" },
      topRisk: "가장 주의가 필요한 서비스",
      topRiskHead: { name: "서비스명", tab: "탭", score: "점수", items: "주요 노출 항목" },
      cleanup: "정리 후보 (오래 방치된 연결)",
      cleanupNone: "현재 기준 정리 후보가 발견되지 않았습니다.",
      categories: "많이 노출된 정보 유형",
      categoriesNone: "집계할 채점 데이터가 없습니다.",
      recommendations: "앞으로의 개선 방향",
      recHigh: (count) => `민감 정보(60점 이상)를 보유한 서비스가 총 ${count}개입니다. 실제로 쓰고 있는지 하나씩 점검하고, 안 쓰는 곳은 연결을 해제하세요.`,
      recCleanup: (count) => `${count}개 이상의 서비스가 오랫동안(91일 이상) 사용되지 않았습니다. 점수와 무관하게 정리 1순위 대상입니다.`,
      recReident: (count) => `${count}개 서비스가 CI/DI 등 교차식별 정보를 갖고 있습니다. 이 값을 가진 서비스는 계정 보안(2단계 인증 등)을 특히 강화하세요.`,
      recFinance: (count) => `${count}개 서비스가 금융/결제 정보를 갖고 있습니다. 이체·소액결제 알림을 켜두면 이상 거래를 빨리 알아챌 수 있습니다.`,
      recSnapshot: "이 리포트는 가입·연동 시점에 동의한 항목의 스냅샷입니다. 실제 서비스 이용 중 직접 입력한 배송지·결제수단 등은 포함되지 않을 수 있습니다.",
      recScoreMeaning: "점수는 정보의 민감도(노출됐을 때 위험한 정도)일 뿐, 그 기업의 보안 수준을 평가하지 않습니다. 우선순위를 정하는 도구로만 활용하세요.",
      footNote: "본 리포트는 개인 검증용 실험적 프로토타입으로 생성되었으며, 법적으로 검증된 개인정보 위험 평가가 아닙니다. 브라우저 내에서 로컬로 분석한 결과이며, 외부로 전송되지 않았습니다.",
    },
    footer: {
      local: "업로드한 파일은 이 브라우저 탭에서만 처리되며 외부로 전송되지 않습니다.",
      experimental: "기술 검증용 프로토타입 — 스키마가 바뀌면 파서 갱신이 필요합니다.",
      privacy: "개인정보 처리방침",
      disclosures: [
        {
          title: "개인정보 보호",
          body: "업로드한 파일은 브라우저 안에서만 분석됩니다. 파일 내용과 분석 결과는 Lethe 서버로 전송되지 않으며, 페이지를 새로고침하거나 종료하면 분석 데이터는 모두 사라집니다.",
        },
        {
          title: "저장 범위",
          body: "업로드한 파일, 파일명, 분석 결과, 자동으로 추출된 전체 서비스 목록은 저장하지 않습니다. 서비스를 더 편리하게 만들기 위해 페이지 방문이나 버튼 클릭과 같은 비식별 이용 통계를 확인할 수 있습니다. 삭제 검토를 요청할 경우, 직접 선택하거나 입력한 서비스명은 삭제 가이드 준비와 지원 우선순위 검토에 사용될 수 있습니다.",
        },
        {
          title: "분석 결과에 대하여",
          body: "분석 결과와 점수는 개인정보의 공유 현황을 이해하기 위한 참고 정보입니다. 모든 서비스나 정보를 완전하게 반영하거나 항상 최신 상태임을 보장하지 않으며, 법률 자문이나 개인정보 보호에 대한 최종 판단을 대신하지 않습니다.",
        },
        {
          title: "베타 안내",
          body: "현재 기능은 베타(Beta) 단계입니다. 일부 서비스나 정보 항목은 아직 지원되지 않을 수 있으며, 분석 기준과 지원 범위는 연구와 사용자 피드백을 바탕으로 지속적으로 개선됩니다.",
        },
        {
          title: "Lethe의 약속",
          body: "당신의 데이터는 당신의 것입니다. Lethe는 사용자의 파일이나 분석 결과를 수집하고 보관하는 것을 목적으로 하지 않습니다. 우리는 당신이 스스로의 데이터를 이해하고, 더 나은 선택을 할 수 있도록 돕기 위해 존재합니다.",
        },
      ],
    },
    cleanupReview: {
      cta: "삭제 검토하기",
      eyebrow: "정리 우선순위",
      title: "서비스를 정리해 볼까요?",
      body: "분석한 서비스 중\n더 이상 사용하지 않거나\n정리를 검토하고 싶은 서비스가 있다면\n선택해 볼 수 있습니다.",
      selectionGuide: "아래 서비스 목록에서 정리하고 싶은 항목을 체크해 주세요.",
      selectedCount: (count) => `${count}개 선택`,
      customOption: "찾는 서비스가 없나요? 직접 입력하기",
      customPlaceholder: "서비스 이름을 직접 입력해 주세요",
      rowCheckboxLabel: (serviceName) => `${serviceName} 정리 검토 대상으로 선택`,
      submit: "삭제 검토 제출하기",
      submitting: "저장하고 있습니다",
      privacyNote:
        "업로드한 파일과 분석 결과는 전송되지 않습니다.\n\n삭제 검토를 요청할 경우, 직접 선택하거나 입력한 서비스명은 삭제 가이드 준비와 지원 우선순위 검토에 사용될 수 있습니다.\n\n아래 버튼을 누르면 위 내용에 동의하게 됩니다.",
      backToResults: "분석 결과로 돌아가기",
      thanksEyebrow: "의견이 도착했습니다",
      thanksTitle: "감사합니다.",
      thanksBody:
        "현재 Lethe는 분석 베타 단계이며,\n직접적인 삭제 지원은 아직 제공하지 않습니다.\n\n선택해 주신 서비스는\n앞으로 지원 범위와 우선순위를 결정하는 데 활용하겠습니다.",
      returnButton: "분석 결과로 돌아가기",
    },
    deleteFlow: {
      ctaAvailable: "Lethe로 해당 서비스 탈퇴 및 정보 삭제하기",
      ctaUnavailable: "이것도 삭제하고 싶어요",
      ctaRequested: "신청 완료",
      newTabNote: "메일 앱에서 새 창으로 열립니다.",
      mailtoFallbackIntro: "메일 앱이 열리지 않으면 아래 내용을 복사해서 직접 보내주세요.",
      copyButton: "복사하기",
      copyDone: "복사됨",
      mailtoSubject: (serviceName) => `[개인정보 삭제 요청] ${serviceName}`,
      mailtoBody: (serviceName) =>
        `안녕하세요,\n\n개인정보 보호법 제36조(개인정보의 정정·삭제 등)에 따라 ${serviceName}에 연동되어 있는 저의 계정 및 개인정보에 대한 삭제(파기)를 요청합니다.\n\n확인 후 처리 결과를 회신해 주시면 감사하겠습니다.\n\n감사합니다.`,
      bulkButton: "일괄 신청",
      bulkModalTitle: "정리 신청 서비스 선택",
      bulkModalBody: "지금 삭제 진행이 불가능한 서비스 목록입니다. 신청할 서비스를 선택해주세요 — 팀이 확인 후 지원 대상에 추가합니다.",
      bulkModalEmpty: "지금은 신청할 서비스가 없습니다.",
      bulkModalConfirm: (count) => `선택한 ${count}개 서비스 신청하기`,
      bulkModalCancel: "취소",
    },
  },
  en: {
    hero: {
      eyebrow: "Review Joined Services",
      title: "See where and how your information has been shared.",
      body: "What once felt difficult to begin now takes about five minutes.\nUploaded files are never sent to a server, and all analysis happens only inside your browser. After the analysis, no data is stored; everything disappears when you refresh.",
    },
    cta: { start: "Start — upload a file", howTo: "See how to prepare your files" },
    trust: {
      localTitle: "Local processing",
      storageTitle: "What is stored",
      storageBody: "Uploaded files, file names, analysis results, and the full automatically extracted service list are not stored.",
      opennessTitle: "Open scoring",
    },
    howto: {
      kakaoTitle: "Kakao",
      kakaoSteps: [
        "Log in at accounts.kakao.com → Account → Personal data usage status",
        "Open the \"Third-party sharing\" tab and save it as HTML with Cmd/Ctrl+S",
      ],
      naverTitle: "Naver",
      naverSteps: [
        "Open the connected-services management page at nid.naver.com",
        "Open DevTools Network tab → refresh the page → right-click → Save all as HAR",
      ],
    },
    dropzone: {
      main: "Prepare your files",
      sub: "You can upload one Kakao file and one Naver file. Uploading a new file replaces the previous one for that slot.",
      privacyNote: "Never sent to a server · processed only in this browser tab",
      chooseFiles: "Choose files",
      clearFiles: "Clear files",
      clearSlot: "Clear",
      ready: "READY",
      empty: "EMPTY",
      filesReady: (count) => `${count} file${count === 1 ? "" : "s"} ready`,
      slotEmpty: "Drop files here",
      kakaoExpected: "Kakao third-party sharing HTML",
      naverExpected: "Naver connected-services HAR",
      otherFiles: "OTHER FILES",
    },
    formats: {
      kakaoTitle: "Kakao third-party sharing",
      kakaoDesc: "The third-party sharing tab from Kakao personal data status saved as HTML (.html)",
      naverTitle: "Naver connected services",
      naverDesc: "A HAR file saved from the connected-services management page (.har)",
      unsupportedNote: "If an unsupported file type is uploaded, you'll get a recognition-failure notice with saving instructions.",
    },
    preStart: {
      title: "Before you start",
      body: "This tool analyzes a snapshot of what you agreed to at signup/linking time — it may not reflect real-time collection.",
      legalNote: "Results have no legal standing and are for reference only.",
      privacyLink: "View privacy policy",
    },
    progress: {
      reading: "Reading files",
      parsing: "Analyzing",
      scoring: "Scoring risk",
      done: "Done",
    },
    errors: {
      harUnrecognized: "Couldn't find connected-service data in this HAR file. Refresh the connected-services page and export again.",
      fileTypeUnrecognized: "This file type wasn't recognized. Please check the supported formats (.html/.htm/.json/.har).",
      fileTooLarge: "This file is too large. Please upload an HTML or HAR file under 10MB.",
      kakaoThirdPartyRequired: "For Kakao, upload only the HTML file saved from the \"Third-party sharing\" tab.",
      naverHarRequired: "For Naver, upload only the HAR file saved from the connected-services management page.",
    },
    disclaimer: {
      snapshot: "This data is a snapshot of what you agreed to at signup or linking time.",
      scoreMeaning: "The score isn't a measure of a company's trustworthiness — it reflects how severe a leak of this data would be.",
    },
    tabs: {
      naver: "Naver connected services",
      kakao: "Kakao connected services",
      kakaoCollect: "Collection & use",
      kakaoCollectExtra: "Collection & use – additional data (purpose unverified)",
      kakaoProvider: "Processing outsourcing",
      generic: "Connected services",
    },
    summary: {
      serviceCount: "Linked services",
      sensitiveCount: "Services holding sensitive data",
      comparableTag: "Externally shared · comparable across platforms",
      platformOnlyTag: "Platform-held only · not directly comparable across platforms",
      noScoreNote: "This tab has no item-level data, so it isn't scored.",
    },
    toolbar: { searchPlaceholder: "Search by service name…", sortButton: "Sort by risk", clearCategoryFilter: "Show all" },
    methodology: {
      summary: "How is this risk score calculated (v1 draft)",
      intro:
        "Collected/shared item text is classified into 15 categories, weights are summed, and normalized to a 0–100 score. Third-party sharing is weighted ×1.3, and a re-identification bonus is added when 3+ of name/birthdate/phone/address appear together. This is not a legally validated standard — it's a v1 heuristic for prioritizing cleanup.",
    },
    rows: {
      whyScore: () => "Risk score notes",
      comboNote: "3 or more of name/birthdate/phone/address appear together, adding a re-identification bonus.",
      staleNote: (days) => `About ${days} days since last use — long-dormant connections make abuse harder to notice, so risk was increased.`,
      cleanupBadge: (days) => `Cleanup candidate · unused ${days} days`,
      emptyResult: "No results",
    },
    report: {
      button: "Create summary report (1-page A4)",
      print: "Print / Save as PDF",
      close: "Close",
      title: "Personal data exposure report",
      generatedAt: (date) => `Generated: ${date} · Review Joined Services v1 (experimental)`,
      overview: "Overview",
      tableHead: { tab: "Tab (platform)", serviceCount: "Services", sensitiveCount: "Sensitive data (60+)" },
      topRisk: "Services needing the most attention",
      topRiskHead: { name: "Service", tab: "Tab", score: "Score", items: "Key exposed items" },
      cleanup: "Cleanup candidates (long-dormant connections)",
      cleanupNone: "No cleanup candidates found right now.",
      categories: "Most-exposed data types",
      categoriesNone: "No scored data to aggregate.",
      recommendations: "What to do next",
      recHigh: (count) => `${count} service${count === 1 ? "" : "s"} hold sensitive data (60+ points). Check whether you still use each one, and disconnect the ones you don't.`,
      recCleanup: (count) => `${count}+ services haven't been used in 91+ days. These are top cleanup priorities regardless of score.`,
      recReident: (count) => `${count} service${count === 1 ? "" : "s"} hold cross-service identifiers (CI/DI). Strengthen account security (e.g. 2FA) for these.`,
      recFinance: (count) => `${count} service${count === 1 ? "" : "s"} hold financial/payment data. Turning on transaction alerts helps you catch unusual activity quickly.`,
      recSnapshot: "This report is a snapshot of what you agreed to at signup/linking — it may not include things you entered directly later, like shipping addresses or payment methods.",
      recScoreMeaning: "The score reflects data sensitivity only, not a company's security posture. Use it to prioritize, not to judge trust.",
      footNote: "This report was generated by an experimental prototype for personal use — it is not a legally validated privacy risk assessment. Everything was analyzed locally in your browser and never sent anywhere.",
    },
    footer: {
      local: "Uploaded files are processed only in this browser tab and are never sent anywhere.",
      experimental: "A technical-validation prototype — the parser will need updates if the source schema changes.",
      privacy: "Privacy policy",
      disclosures: [
        {
          title: "Privacy protection",
          body: "Uploaded files are analyzed only inside your browser. File contents and analysis results are not sent to Lethe servers, and analysis data disappears when you refresh or close the page.",
        },
        {
          title: "What is stored",
          body: "Uploaded files, file names, analysis results, and the full automatically extracted service list are not stored. To make the service easier to use, Lethe may review non-identifying usage analytics such as page visits or button clicks. If you request a cleanup review, the service names you directly select or enter may be used to prepare deletion guides and review support priorities.",
        },
        {
          title: "About analysis results",
          body: "Analysis results and scores are reference information intended to help you understand how your personal information may have been shared. They may not fully reflect every service or item of information, may not always be up to date, and do not replace legal advice or final judgments about privacy protection.",
        },
        {
          title: "Beta notice",
          body: "This feature is currently in beta. Some services or information fields may not yet be supported, and the analysis criteria and coverage will continue to improve through research and user feedback.",
        },
        {
          title: "Lethe's promise",
          body: "Your data belongs to you. Lethe does not exist to collect or store your files or analysis results. We exist to help you understand your own data and make better choices.",
        },
      ],
    },
    cleanupReview: {
      cta: "Review for cleanup",
      eyebrow: "Cleanup priorities",
      title: "Shall we look at what to clean up?",
      body: "If any analyzed services are no longer used\nor feel worth reviewing,\nyou can select them here.",
      selectionGuide: "Check the services you want to review in the list below.",
      selectedCount: (count) => `${count} selected`,
      customOption: "Can't find a service? Add it directly",
      customPlaceholder: "Enter a service name",
      rowCheckboxLabel: (serviceName) => `Select ${serviceName} for cleanup review`,
      submit: "Submit cleanup review",
      submitting: "Saving",
      privacyNote:
        "Uploaded files and analysis results are not sent.\n\nIf you request a cleanup review, the service names you directly select or enter may be used to prepare deletion guides and review support priorities.\n\nBy pressing the button below, you agree to the above.",
      backToResults: "Back to analysis results",
      thanksEyebrow: "Your signal was received",
      thanksTitle: "Thank you.",
      thanksBody:
        "Lethe is currently in analysis beta,\nand does not yet provide direct deletion support.\n\nThe services you selected will help us decide\nwhat to support and prioritize next.",
      returnButton: "Back to analysis results",
    },
    deleteFlow: {
      ctaAvailable: "Delete this service via Lethe",
      ctaUnavailable: "I want this deleted too",
      ctaRequested: "Requested",
      newTabNote: "Opens a new draft in your mail app.",
      mailtoFallbackIntro: "If your mail app doesn't open, copy the text below and send it yourself.",
      copyButton: "Copy",
      copyDone: "Copied",
      mailtoSubject: (serviceName) => `[Personal Data Deletion Request] ${serviceName}`,
      mailtoBody: (serviceName) =>
        `Hello,\n\nUnder Article 36 of Korea's Personal Information Protection Act (right to request correction/deletion), I am requesting the deletion (destruction) of my account and personal data held by ${serviceName}.\n\nPlease confirm and let me know once this has been processed.\n\nThank you.`,
      bulkButton: "Request all",
      bulkModalTitle: "Choose services to request",
      bulkModalBody: "These are the services Lethe can't delete for you yet. Pick the ones you'd like to request — the team will review and add support.",
      bulkModalEmpty: "There's nothing to request right now.",
      bulkModalConfirm: (count) => `Request ${count} selected service${count === 1 ? "" : "s"}`,
      bulkModalCancel: "Cancel",
    },
  },
  ja: {
    hero: {
      eyebrow: "登録したサービスを見る",
      title: "自分の情報がどこに、どのように共有されたのかを確認してみてください。",
      body: "始めるまでが複雑に感じられたことも、今は約5分で十分です。\nアップロードしたファイルはサーバーに送信されず、すべての分析はブラウザ内だけで行われます。分析後、データは保存されず、ページを更新するとすべて消えます。",
    },
    cta: { start: "始める — ファイルをアップロード", howTo: "ファイルの準備方法を見る" },
    trust: {
      localTitle: "ローカル処理",
      storageTitle: "保存される範囲",
      storageBody: "アップロードしたファイル、ファイル名、分析結果、自動抽出されたサービス一覧全体は保存されません。",
      opennessTitle: "開かれた分析",
    },
    howto: {
      kakaoTitle: "Kakao",
      kakaoSteps: [
        "accounts.kakao.comにログイン → アカウント → 個人情報利用現況",
        "「第三者提供」タブを開き、Cmd/Ctrl+SでHTMLとして保存",
      ],
      naverTitle: "Naver",
      naverSteps: [
        "nid.naver.comで連携サービス管理ページを開く",
        "開発者ツールのNetworkタブ → ページ再読み込み → 右クリック → Save all as HARで保存",
      ],
    },
    dropzone: {
      main: "ファイルを準備してください",
      sub: "KakaoファイルとNaverファイルをそれぞれ1件ずつアップロードできます。新しいファイルを入れると、そのスロットの既存ファイルは置き換わります。",
      privacyNote: "サーバーには送信されません · このブラウザタブ内でのみ処理されます",
      chooseFiles: "ファイルを選択",
      clearFiles: "ファイル解除",
      clearSlot: "解除",
      ready: "READY",
      empty: "EMPTY",
      filesReady: (count) => `${count}件のファイル準備完了`,
      slotEmpty: "ここにファイルを置いてください",
      kakaoExpected: "Kakao第三者提供HTML",
      naverExpected: "Naver連携サービスHAR",
      otherFiles: "OTHER FILES",
    },
    formats: {
      kakaoTitle: "Kakao第三者提供",
      kakaoDesc: "Kakao個人情報現況の第三者提供タブをHTMLで保存したファイル (.html)",
      naverTitle: "Naver連携サービス",
      naverDesc: "連携サービス管理ページから保存したHARファイル (.har)",
      unsupportedNote: "サポート外のファイル形式をアップロードすると、認識失敗の案内と保存方法が表示されます。",
    },
    preStart: {
      title: "始める前にご確認ください",
      body: "このツールは登録・連携当時に同意した項目のスナップショットを分析します。リアルタイムの収集内容ではない場合があります。",
      legalNote: "分析結果に法的効力はなく、参考情報です。",
      privacyLink: "プライバシーポリシーを確認",
    },
    progress: {
      reading: "ファイルを読み込み中",
      parsing: "分析中",
      scoring: "リスクを採点中",
      done: "完了",
    },
    errors: {
      harUnrecognized: "HARファイル内で連携サービスのデータが見つかりませんでした。連携サービスページを再読み込みしてから再度書き出してください。",
      fileTypeUnrecognized: "このファイル形式は認識できませんでした。対応形式(.html/.htm/.json/.har)をご確認ください。",
      fileTooLarge: "ファイルが大きすぎます。10MB以下のHTMLまたはHARファイルをアップロードしてください。",
      kakaoThirdPartyRequired: "Kakaoは、個人情報現況の「第三者提供」タブをHTMLで保存したファイルのみアップロードしてください。",
      naverHarRequired: "Naverは、連携サービス管理ページから保存したHARファイルのみアップロードしてください。",
    },
    disclaimer: {
      snapshot: "このデータは登録・連携当時に同意した項目のスナップショットです。",
      scoreMeaning: "スコアは企業の信頼度ではなく、情報が流出した場合の深刻さを表します。",
    },
    tabs: {
      naver: "Naver連携サービス",
      kakao: "Kakao連携サービス",
      kakaoCollect: "収集及び利用",
      kakaoCollectExtra: "収集及び利用 – 付加情報(用途未確認)",
      kakaoProvider: "処理委託",
      generic: "連携サービス一覧",
    },
    summary: {
      serviceCount: "登録・連携済みサービス数",
      sensitiveCount: "機微情報保有サービス数",
      comparableTag: "外部提供型 · 他プラットフォームと比較可能",
      platformOnlyTag: "プラットフォーム自社保有型 · 他プラットフォームと直接比較不可",
      noScoreNote: "このタブは項目単位のデータがないため採点対象外です。",
    },
    toolbar: { searchPlaceholder: "サービス名で検索…", sortButton: "リスクが高い順", clearCategoryFilter: "すべて表示" },
    methodology: {
      summary: "このリスクスコアはどう計算されているか (v1草案)",
      intro:
        "収集・提供される項目テキストを15カテゴリに分類し、カテゴリごとの重みを合算して0〜100点に正規化します。第三者提供項目は1.3倍加重し、氏名・生年月日・連絡先・住所のうち3つ以上が同時に使われる場合は再識別リスクのボーナスを加算します。法的に検証された基準ではなく、優先順位付けのためのv1ヒューリスティック草案です。",
    },
    rows: {
      whyScore: () => "リスクスコア解説",
      comboNote: "氏名・生年月日・連絡先・住所のうち3つ以上が揃っているため、追加加算されました。",
      staleNote: (days) => `最終利用日から約${days}日経過 — 長期間放置された連携は悪用に気づきにくいため、リスクを加算しました。`,
      cleanupBadge: (days) => `整理候補 · ${days}日未使用`,
      emptyResult: "結果がありません",
    },
    report: {
      button: "要約レポートを作成 (A4 1枚)",
      print: "印刷 / PDFとして保存",
      close: "閉じる",
      title: "個人情報露出状況レポート",
      generatedAt: (date) => `生成日時: ${date} · 登録したサービスを見る v1 (実験的機能)`,
      overview: "概要",
      tableHead: { tab: "タブ(プラットフォーム)", serviceCount: "サービス数", sensitiveCount: "機微情報保有(60点以上)" },
      topRisk: "最も注意が必要なサービス",
      topRiskHead: { name: "サービス名", tab: "タブ", score: "スコア", items: "主な露出項目" },
      cleanup: "整理候補(長期間放置された連携)",
      cleanupNone: "現時点で整理候補は見つかりませんでした。",
      categories: "多く露出している情報タイプ",
      categoriesNone: "集計できる採点データがありません。",
      recommendations: "今後の改善方向",
      recHigh: (count) => `機微情報(60点以上)を保有するサービスが計${count}件あります。実際に使用しているか一つずつ確認し、使わないものは連携を解除してください。`,
      recCleanup: (count) => `${count}件以上のサービスが長期間(91日以上)未使用です。スコアに関わらず整理の最優先対象です。`,
      recReident: (count) => `${count}件のサービスがCI/DIなどの相互識別情報を保有しています。これらのサービスはアカウントセキュリティ(2段階認証など)を特に強化してください。`,
      recFinance: (count) => `${count}件のサービスが金融・決済情報を保有しています。振込・少額決済の通知をオンにしておくと異常な取引に早く気づけます。`,
      recSnapshot: "本レポートは登録・連携時点で同意した項目のスナップショットです。実際のサービス利用中に直接入力した配送先・決済手段などは含まれない場合があります。",
      recScoreMeaning: "スコアは情報の機微度(露出時の危険度)のみを示し、企業のセキュリティ水準を評価するものではありません。優先順位を決めるための道具としてのみご活用ください。",
      footNote: "本レポートは個人検証用の実験的プロトタイプとして生成されたものであり、法的に検証された個人情報リスク評価ではありません。ブラウザ内でローカルに分析された結果であり、外部には送信されていません。",
    },
    footer: {
      local: "アップロードしたファイルはこのブラウザタブ内でのみ処理され、外部には送信されません。",
      experimental: "技術検証用プロトタイプ — スキーマが変わるとパーサーの更新が必要です。",
      privacy: "プライバシーポリシー",
      disclosures: [
        {
          title: "個人情報の保護",
          body: "アップロードしたファイルはブラウザ内だけで分析されます。ファイル内容と分析結果はLetheのサーバーに送信されず、ページを更新または終了すると分析データはすべて消えます。",
        },
        {
          title: "保存される範囲",
          body: "アップロードしたファイル、ファイル名、分析結果、自動抽出されたサービス一覧全体は保存されません。サービスをより使いやすくするため、ページ訪問やボタンのクリックなど、個人を特定しない利用統計を確認することがあります。削除検討を依頼する場合、直接選択または入力したサービス名は、削除ガイドの準備と支援優先順位の検討に使用されることがあります。",
        },
        {
          title: "分析結果について",
          body: "分析結果とスコアは、個人情報の共有状況を理解するための参考情報です。すべてのサービスや情報を完全に反映すること、また常に最新であることを保証するものではなく、法律上の助言や個人情報保護に関する最終判断に代わるものではありません。",
        },
        {
          title: "ベータ版について",
          body: "現在の機能はベータ(Beta)段階です。一部のサービスや情報項目はまだ対応していない場合があり、分析基準と対応範囲は研究とユーザーフィードバックをもとに継続的に改善されます。",
        },
        {
          title: "Letheの約束",
          body: "あなたのデータは、あなたのものです。Letheは、ユーザーのファイルや分析結果を収集・保管することを目的としていません。私たちは、あなたが自分自身のデータを理解し、よりよい選択ができるよう支援するために存在します。",
        },
      ],
    },
    cleanupReview: {
      cta: "削除を検討する",
      eyebrow: "整理の優先順位",
      title: "サービスを整理してみますか？",
      body: "分析したサービスの中で、\nもう使っていないものや\n整理を検討したいものがあれば\n選んでみることができます。",
      selectionGuide: "下のサービス一覧から、整理したい項目にチェックを入れてください。",
      selectedCount: (count) => `${count}件選択`,
      customOption: "探しているサービスがありませんか？直接入力する",
      customPlaceholder: "サービス名を入力してください",
      rowCheckboxLabel: (serviceName) => `${serviceName}を整理検討対象として選択`,
      submit: "削除検討を送信する",
      submitting: "保存しています",
      privacyNote:
        "アップロードしたファイルと分析結果は送信されません。\n\n削除検討を依頼する場合、直接選択または入力したサービス名は、削除ガイドの準備と支援優先順位の検討に使用されることがあります。\n\n下のボタンを押すと、上記の内容に同意したものとみなされます。",
      backToResults: "分析結果に戻る",
      thanksEyebrow: "ご意見を受け取りました",
      thanksTitle: "ありがとうございます。",
      thanksBody:
        "現在Letheは分析ベータ段階であり、\n直接的な削除支援はまだ提供していません。\n\n選んでいただいたサービスは、\n今後の対応範囲と優先順位を決めるために活用します。",
      returnButton: "分析結果に戻る",
    },
    deleteFlow: {
      ctaAvailable: "Letheで該当サービスを退会・情報削除する",
      ctaUnavailable: "これも削除したい",
      ctaRequested: "申請済み",
      newTabNote: "メールアプリで新しい下書きが開きます。",
      mailtoFallbackIntro: "メールアプリが開かない場合は、以下の内容をコピーしてご自身で送信してください。",
      copyButton: "コピー",
      copyDone: "コピーしました",
      mailtoSubject: (serviceName) => `【個人情報削除依頼】${serviceName}`,
      mailtoBody: (serviceName) =>
        `こんにちは。\n\n韓国の個人情報保護法第36条(個人情報の訂正・削除等)に基づき、${serviceName}に連携されている私のアカウントおよび個人情報の削除(破棄)を依頼いたします。\n\nご確認の上、対応結果をご返信いただけますと幸いです。\n\nよろしくお願いいたします。`,
      bulkButton: "一括申請",
      bulkModalTitle: "申請するサービスを選択",
      bulkModalBody: "現在Letheで削除を進められないサービスの一覧です。申請したいサービスを選んでください — チームが確認の上、対応対象に追加します。",
      bulkModalEmpty: "現在申請できるサービスはありません。",
      bulkModalConfirm: (count) => `選択した${count}件のサービスを申請する`,
      bulkModalCancel: "キャンセル",
    },
  },
};

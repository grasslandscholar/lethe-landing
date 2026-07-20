import type { TaxonomyCategory } from "./types";

export const TAXONOMY: TaxonomyCategory[] = [
  {
    id: "reident",
    weight: 10,
    patterns: [/연계정보/, /중복가입확인정보/, /\bCI\b/, /\bDI\b/, /전자서명값/, /서명데이터/, /고유\s*식별자/],
    label: {
      ko: "교차식별자(CI/DI 등)",
      en: "Cross-service identifiers (CI/DI)",
      ja: "相互識別子(CI/DIなど)",
    },
    rationale: {
      ko: "서비스마다 다른 계정으로 가입해도 이 값으로 \"같은 사람\"임을 대조할 수 있어, 단일 유출이라도 다른 데이터셋과 결합되면 신원이 특정됩니다.",
      en: "This value lets different services confirm you're the same person even if you signed up separately — a single leak can identify you when combined with another dataset.",
      ja: "サービスごとに別のアカウントで登録しても、この値で「同一人物」であることが照合可能なため、単一の流出でも他のデータと組み合わさると身元が特定されます。",
    },
  },
  {
    id: "finance",
    weight: 9,
    patterns: [/계좌/, /예금주/, /카드번호/, /카드사/, /승인번호/, /할부/, /결제\s*(내역|수단|금액)/, /환불/],
    label: {
      ko: "금융/결제 정보",
      en: "Financial / payment information",
      ja: "金融・決済情報",
    },
    rationale: {
      ko: "계좌·카드 정보는 직접적인 금전 피해(부정결제, 명의도용)로 이어질 수 있습니다.",
      en: "Account and card details can lead directly to financial loss such as fraudulent charges or identity theft.",
      ja: "口座・カード情報は不正決済やなりすましなど、直接的な金銭被害につながる可能性があります。",
    },
  },
  {
    id: "gov_id",
    weight: 8,
    patterns: [/자격증/, /자격종목/, /신분증/, /여권/, /사업자등록/],
    label: {
      ko: "정부발급 신분/자격 증명",
      en: "Government-issued ID / credentials",
      ja: "政府発行の身分・資格証明",
    },
    rationale: {
      ko: "공적 신분·자격을 증명하는 정보로, 위조·도용 시 법적·사회적 피해가 큽니다.",
      en: "Proof of official identity or qualifications — forgery or misuse can cause serious legal and social harm.",
      ja: "公的な身分・資格を証明する情報であり、偽造・悪用時の法的・社会的被害が大きくなります。",
    },
  },
  {
    id: "location",
    weight: 7,
    patterns: [/위치정보/, /GPS/, /현재\s*위치/, /실시간\s*위치/],
    label: {
      ko: "정밀 위치정보",
      en: "Precise location data",
      ja: "精密位置情報",
    },
    rationale: {
      ko: "실시간 위치는 물리적 안전(스토킹 등)과 직결되는 민감정보입니다.",
      en: "Real-time location is sensitive data directly tied to physical safety, including stalking risk.",
      ja: "リアルタイム位置情報はストーカー被害など、身体的安全に直結する機微情報です。",
    },
  },
  {
    id: "address",
    weight: 6,
    patterns: [/주소/, /배송지/, /수령지/, /수령인/],
    label: {
      ko: "주소",
      en: "Address",
      ja: "住所",
    },
    rationale: {
      ko: "거주지가 특정되면 물리적 접근이 가능해져 스토킹·범죄에 악용될 수 있습니다.",
      en: "Once your residence is identified, physical access becomes possible — a risk for stalking or crime.",
      ja: "居住地が特定されると物理的な接近が可能になり、ストーカーや犯罪に悪用される恐れがあります。",
    },
  },
  {
    id: "behavior",
    weight: 5,
    patterns: [/이용\s*내역/, /이용\s*기록/, /구매\s*(내역|기록)/, /감상\s*내역/, /검색\s*기록/, /활동\s*(기록|이력)/, /방문/],
    label: {
      ko: "서비스 이용/행동 데이터",
      en: "Usage / behavioral data",
      ja: "利用・行動データ",
    },
    rationale: {
      ko: "구매·시청·검색 이력이 쌓이면 취향, 습관, 심지어 건강·재정 상태까지 추론(프로파일링)될 수 있습니다.",
      en: "Accumulated purchase, viewing, or search history can be used to infer your habits, tastes, or even health and finances.",
      ja: "購買・視聴・検索履歴が蓄積されると、嗜好や習慣、さらには健康・財政状態まで推測(プロファイリング)される可能性があります。",
    },
  },
  {
    id: "phone",
    weight: 5,
    patterns: [/휴대전화번호/, /휴대폰번호/, /연락처/, /전화번호/],
    label: {
      ko: "연락처(휴대전화번호)",
      en: "Phone number",
      ja: "連絡先(携帯電話番号)",
    },
    rationale: {
      ko: "스팸·스미싱 등 직접적인 접촉 채널로 악용될 수 있습니다.",
      en: "Can be abused as a direct contact channel for spam or smishing.",
      ja: "スパムやスミッシングなど、直接的な接触経路として悪用される可能性があります。",
    },
  },
  {
    id: "friends",
    weight: 4,
    patterns: [/친구\s*목록/, /소셜\s*그래프/],
    label: {
      ko: "친구목록/소셜그래프",
      en: "Friend list / social graph",
      ja: "友達リスト・ソーシャルグラフ",
    },
    rationale: {
      ko: "본인뿐 아니라 연결된 지인들의 관계 정보까지 노출되어 파급 범위가 큽니다.",
      en: "Exposes not just you but your connections' relationships too, widening the impact.",
      ja: "本人だけでなく、つながっている知人の関係情報まで露出するため、影響範囲が大きくなります。",
    },
  },
  {
    id: "email",
    weight: 4,
    patterns: [/이메일/],
    label: {
      ko: "이메일",
      en: "Email address",
      ja: "メールアドレス",
    },
    rationale: {
      ko: "계정 탈취 시도(피싱)의 시작점이 되는 경우가 많습니다.",
      en: "Often the starting point for account-takeover attempts via phishing.",
      ja: "アカウント乗っ取り(フィッシング)の起点になることが多くあります。",
    },
  },
  {
    id: "birth",
    weight: 4,
    patterns: [/생년월일/, /생일/, /출생연도/],
    label: {
      ko: "생년월일",
      en: "Date of birth",
      ja: "生年月日",
    },
    rationale: {
      ko: "다른 정보와 결합되면 본인 확인 절차를 우회하는 데 쓰일 수 있습니다.",
      en: "Combined with other data, it can be used to bypass identity-verification steps.",
      ja: "他の情報と組み合わさると、本人確認手続きを回避するために使われる可能性があります。",
    },
  },
  {
    id: "name",
    weight: 3,
    patterns: [/이름/, /성명/, /실명(?!\s*확인)/],
    label: {
      ko: "이름",
      en: "Name",
      ja: "氏名",
    },
    rationale: {
      ko: "단독으로는 식별력이 제한적이나 다른 항목과 결합 시 위험도가 커집니다.",
      en: "Limited identifying power alone, but risk grows sharply when combined with other fields.",
      ja: "単独では識別力が限定的ですが、他の項目と組み合わさると危険度が高まります。",
    },
  },
  {
    id: "device",
    weight: 3,
    patterns: [/IP\s*주소/, /쿠키/, /단말기/, /하드웨어/, /운영체제/],
    label: {
      ko: "기기/네트워크 정보",
      en: "Device / network information",
      ja: "端末・ネットワーク情報",
    },
    rationale: {
      ko: "추적(트래킹) 및 부정이용 탐지에 쓰이며, 단독 식별력은 낮은 편입니다.",
      en: "Used for tracking and fraud detection; identifying power alone is relatively low.",
      ja: "追跡(トラッキング)や不正利用の検知に使われますが、単独の識別力は低めです。",
    },
  },
  {
    id: "telecom",
    weight: 2,
    patterns: [/통신사업자/, /통신사/],
    label: {
      ko: "통신사 정보",
      en: "Telecom carrier",
      ja: "通信事業者情報",
    },
    rationale: {
      ko: "단독으로는 위험도가 낮지만 본인인증 절차의 구성요소로 쓰입니다.",
      en: "Low risk alone, but it's a building block of identity-verification flows.",
      ja: "単独では危険度は低いものの、本人認証手続きの構成要素として使われます。",
    },
  },
  {
    id: "gender",
    weight: 2,
    patterns: [/성별/],
    label: {
      ko: "성별",
      en: "Gender",
      ja: "性別",
    },
    rationale: {
      ko: "단독 민감도는 낮지만 결합 프로파일링 요소로 쓰입니다.",
      en: "Low sensitivity alone, but used as a factor in combined profiling.",
      ja: "単独の機微性は低いものの、組み合わせによるプロファイリング要素として使われます。",
    },
  },
  {
    id: "profile",
    weight: 1,
    patterns: [/닉네임/, /프로필\s*사진/, /프로필(?!\s*정보)/],
    label: {
      ko: "프로필(닉네임/사진)",
      en: "Profile (nickname / photo)",
      ja: "プロフィール(ニックネーム・写真)",
    },
    rationale: {
      ko: "공개 프로필 성격이 강해 상대적으로 민감도가 낮습니다.",
      en: "Largely public-facing by nature, so sensitivity is relatively low.",
      ja: "公開プロフィールの性格が強く、相対的に機微度は低めです。",
    },
  },
];

export const COMBO_IDS = ["name", "birth", "phone", "address"];

export function classify(text: string): TaxonomyCategory[] {
  if (!text) return [];
  const matched: TaxonomyCategory[] = [];
  const seen = new Set<string>();
  for (const category of TAXONOMY) {
    for (const pattern of category.patterns) {
      if (pattern.test(text) && !seen.has(category.id)) {
        matched.push(category);
        seen.add(category.id);
        break;
      }
    }
  }
  return matched;
}

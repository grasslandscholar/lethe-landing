export type Locale = "ko" | "en" | "ja";

export const translations = {
  ko: {
    nav: {
      cta: "인터뷰 참여하기",
      privacy: "쓰는 정보",
    },
    hero: {
      title: "LETHE",
      sub1: "고요히 흘려보내다.",
    },
    story: {
      label: "시작",
      heading: "계정을 하나\n삭제하려고 했습니다.",
      body: "간단한 일이라고 생각했습니다.\n하지만 실제로는 다섯 번의 이메일을 주고받아야 했고,\n삭제가 완료되기까지 17일이 걸렸습니다.\n\n그 과정에서 GDPR과 개인정보 삭제 요청 절차를 공부했습니다.\n하지만 돌아오는 답변의 대부분은 형식적인 안내이거나,\n책임을 미루는 회신이었습니다.",
      evidenceIntro: "계정 하나가 삭제되기까지 —",
      evidence: [
        { value: "5", unit: "번", label: "주고받은 이메일" },
        { value: "17", unit: "일", label: "삭제 완료까지 걸린 시간" },
      ],
      questionLabel: "그때 처음으로 궁금해졌습니다.",
      question: "내 정보는 지금\n어디에 남아 있을까?",
      beginning: {
        kicker: "그때 생각했습니다.",
        heading: "혼자서 하기에는\n생각보다 훨씬\n어려운 일이 아닐까.",
        body: "Lethe는 그 질문에서 시작되었습니다.",
      },
    },
    service: {
      label: "Lethe가 돕는 방식",
      intro: {
        heading: "무엇을 남길지,\n무엇을 흘려보낼지.",
        body: "Lethe는 내가 남긴 디지털 흔적을 차분히 확인하고, 깊이 이해하며, 스스로 선택하도록 돕는 도구입니다.",
      },
      features: [
        {
          heading: "확인하기",
          body: "흩어진 계정을 모아 봅니다.",
        },
        {
          heading: "이해하기",
          body: "어떤 정보가 어떻게 이용되고 있는지 이해합니다.",
        },
        {
          heading: "정리하기",
          body: "남길 것과 흘려보낼 것을 선택합니다.",
        },
      ],
      visuals: {
        check: {
          services: ["Google", "Naver", "Apple"],
          recent: "최근 확인 12일 전",
          needsCheck: "확인 필요",
        },
        understand: {
          status: "검토 필요",
          scoreUnit: "점",
          inactive: "3년째 사용하지 않음",
          adProfile: {
            term: "광고 프로필",
            suffix: " 제공 중",
            title: "광고 프로필",
            intro: [
              "서비스는 이용 기록과 관심사를 바탕으로 사용자 프로필을 만들 수 있습니다.",
              "예를 들어 여행을 자주 검색했다면, 여행 관련 광고나 추천이 더 많이 보이는 식으로 프로필이 만들어집니다.",
            ],
            whyTitle: "왜 알아야 할까요?",
            why: [
              "이 프로필은 사용자가 무엇에 관심이 있는지 추정하는 데 활용됩니다.",
              "대부분은 광고나 추천을 더 관련성 있게 보여주기 위한 목적이지만, 어떤 정보가 활용되고 있는지는 서비스마다 다를 수 있습니다.",
            ],
          },
          location: {
            term: "위치 정보",
            suffix: " 수집 중",
            title: "위치 정보",
            intro: [
              "서비스는 사용자의 위치를 활용할 수 있습니다.",
              "예를 들어 주변 매장을 보여주거나, 지역에 맞는 추천을 제공할 때 사용됩니다.",
            ],
            whyTitle: "왜 알아야 할까요?",
            why: [
              "위치 정보는 매우 유용할 수 있지만, 동시에 사용자의 생활 패턴을 추정하는 데 활용될 수도 있습니다.",
              "따라서 위치 정보가 언제, 어떤 목적으로 사용되는지 알고 있는 것이 좋습니다.",
            ],
          },
        },
        organize: {
          keep: "남겨둘 것",
          release: "흘려보낼 것",
          unit: "개",
        },
      },
    },
    vision: {
      label: "Lethe의 방향",
      heading: "모든 사람이 자신의\n디지털 삶을 자유롭게\n정리할 수 있는 세상",
      body: "불안감 없이. 기술 용어 없이. 그저 고요하게.",
    },
    cta: {
      label: "인터뷰 참여",
      heading: "모든 흐름에는\n시작이 있습니다.",
      body: "당신의 경험이 Lethe의 첫 흐름이 됩니다.",
      perks: [
        "탈퇴했는데도 정보가 남아있는 줄 몰랐어요.",
        "어디에 가입했는지 기억도 잘 안 났어요.",
        "삭제 요청을 몇 번이나 보냈는지 모르겠어요.",
      ],
      stream: [
        {
          quote: "탈퇴했는데도\n정보가 남아있는 줄 몰랐어요.",
          insight: "연결 해제와 삭제는\n항상 같은 의미가 아닙니다.",
        },
        {
          quote: "어디에 가입했는지\n기억도 잘 안 났어요.",
          insight: "오래된 계정은\n스스로도 찾기 어려운 경우가 있습니다.",
        },
        {
          quote: "삭제 요청을 몇 번이나\n보냈는지 모르겠어요.",
          insight: "생각보다 정보를 지우는 일은\n오랜 시간이 걸릴 수 있습니다.",
        },
        {
          quote: "정말 나는\n잊힐 권리를 가지고 있는가.",
          insight: "문득 든 생각에 계정을 삭제해 보기로 했습니다.",
          linkText: "생각보다 긴 여정이 시작되었습니다.",
        },
      ],
      button: "인터뷰 신청하기",
      note: "*약 30분 소요.",
      transparency: {
        heading: "Lethe는 이 페이지에서 인터뷰 신청에 필요한 정보만 사용합니다.",
        body: "이름 또는 닉네임, 이메일 주소, 신청 내용만 받습니다.\n수집된 정보는 인터뷰 진행과 Lethe 연구·개발을 위해 사용됩니다.\n언제든지 삭제를 요청할 수 있습니다.",
        button: "쓰는 정보 보기",
      },
    },
    footer: {
      tagline: "고요히 흘려보내다.",
      rights: "© 2026 Lethe. All rights reserved.",
      privacy: "쓰는 정보",
      contact: "문의하기",
    },
    note01: {
      label: "Lethe Note 01",
      title: "정말 나는\n잊힐 권리를\n가지고 있는가.",
      intro: "문득 든 생각에 계정을 삭제해 보기로 했습니다.\n그리고, 생각보다 긴 여정이 시작되었습니다.",
      sections: [
        {
          heading: null,
          body: [
            "계정을 하나 삭제하려고 했습니다.",
            "간단한 일이라고 생각했습니다. 설정 메뉴를 열고, 탈퇴 버튼을 누르고, 확인하면 끝날 줄 알았습니다. 하지만 실제로는 다섯 번의 이메일을 주고받아야 했고, 삭제가 완료되기까지 17일이 걸렸습니다.",
            "그 과정에서 GDPR과 개인정보 삭제 요청 절차를 공부했습니다. 하지만 돌아오는 답변의 대부분은 형식적인 안내이거나, 책임을 미루는 회신이었습니다.",
          ],
        },
        {
          heading: "연결 해제와 삭제는\n같은 의미가 아닙니다.",
          body: [
            "많은 서비스에서 '탈퇴'는 계정의 로그인 접근을 막는 것일 뿐, 데이터 자체를 지우지 않습니다. 백업 서버에, 파트너사에, 광고 플랫폼에 — 당신의 흔적은 여전히 어딘가에 남아 있을 수 있습니다.",
            "탈퇴했는데도 정보가 남아있다는 사실을 아는 사람은 많지 않습니다. 알더라도, 그것을 실제로 지우는 방법을 아는 사람은 더 적습니다.",
          ],
        },
        {
          heading: "어디에 가입했는지\n기억도 잘 안 났습니다.",
          body: [
            "삭제를 시도하면서 처음 마주한 문제는, 내가 어느 서비스에 어떤 이메일로 가입했는지를 제대로 파악하지 못하고 있다는 것이었습니다.",
            "오래된 계정은 스스로도 찾기 어려운 경우가 있습니다. 소셜 로그인으로 가입한 계정, 이벤트 때 잠깐 사용한 서비스, 더 이상 존재하지 않는다고 생각했던 앱들. 그것들은 여전히 어딘가에 내 정보를 갖고 있었습니다.",
          ],
        },
        {
          heading: "혼자서 하기에는\n생각보다 훨씬 어려운 일.",
          body: [
            "정보를 지운다는 것은 권리의 문제이기도 하지만, 동시에 매우 실용적인 문제이기도 합니다. 어디에 연락해야 하는지, 어떤 형식으로 요청해야 하는지, 얼마나 기다려야 하는지 — 이 모든 것을 혼자 파악하고 실행하는 것은 생각보다 많은 시간과 에너지를 요구합니다.",
            "Lethe는 그 질문에서 시작되었습니다.",
          ],
        },
      ],
      cta: {
        heading: "당신의 경험도\nLethe의 첫 흐름이 됩니다.",
        button: "인터뷰 신청하기",
        note: "* 약 30분 소요.",
      },
    },
    privacy: {
      title: "당신이 알려준 정보는 어떻게 사용될까요?",
      subtitle: "(개인정보처리방침)",
      easyTab: "아주 쉽게 읽기",
      detailTab: "자세히 알아보기",
      close: "닫기",
      easy: {
        paragraphs: [
          "Lethe는 현재 서비스 개발을 위한 사용자 인터뷰를 진행하고 있습니다.",
          "우리는 인터뷰를 진행하기 위해 필요한 최소한의 정보만 받습니다.",
        ],
        collectedTitle: "수집하는 정보",
        collected: ["이름 또는 닉네임", "이메일 주소", "인터뷰 신청 시 작성한 내용"],
        after: [
          "수집된 정보는 인터뷰 진행과 Lethe 연구·개발을 위해 사용됩니다.",
          "삭제를 요청하면 관련 정보는 삭제됩니다.",
        ],
        contactTitle: "문의",
        contact: "connect.lethe@gmail.com",
      },
      detail: {
        heading: "개인정보처리방침",
        updated: "최종 수정일: 2026.06.23",
        sections: [
          {
            title: "수집하는 정보",
            items: ["이름 또는 닉네임", "이메일 주소", "인터뷰 신청 과정에서 사용자가 직접 작성한 내용"],
          },
          {
            title: "정보를 사용하는 이유",
            items: ["인터뷰 일정 조율", "사용자 경험 및 의견 수집", "서비스 연구 및 개발"],
          },
          {
            title: "보관 기간",
            body: "수집된 정보는 연구 및 인터뷰 진행을 위해 보관되며, 아래의 경우 지체 없이 삭제됩니다.",
            items: ["연구 목적이 달성된 경우", "이용자가 삭제를 요청한 경우"],
          },
          {
            title: "제3자 제공",
            body: "현재 Lethe는 인터뷰 진행과 연구·개발에 필요한 범위 안에서 정보를 사용합니다. 외부 서비스 이용 과정에서 필요한 정보가 해당 서비스에 전달될 수 있습니다.",
          },
          {
            title: "외부 서비스 이용",
            body: "인터뷰 신청 및 일정 조율 과정에서 아래와 같은 외부 서비스를 사용할 수 있습니다. 해당 서비스 이용 과정에서 필요한 정보가 해당 서비스에 전달될 수 있습니다.",
            items: ["Google Forms", "Google Calendar", "Calendly"],
          },
          {
            title: "이용자의 권리",
            body: "이용자는 언제든지 자신의 정보에 대해 아래 요청을 할 수 있습니다.",
            items: ["열람", "수정", "삭제"],
          },
        ],
        contactTitle: "문의",
        contact: "connect.lethe@gmail.com",
      },
    },
  },

  en: {
    nav: {
      cta: "Join the Interview",
      privacy: "Data We Use",
    },
    hero: {
      title: "LETHE",
      sub1: "As the river carries it away.",
    },
    story: {
      label: "Beginning",
      heading: "I tried to delete\none account.",
      body: "I thought it would be simple.\nInstead, it took five emails\nand 17 days until the deletion was complete.\n\nAlong the way, I studied GDPR and personal data deletion requests.\nMost replies were formal instructions\nor messages that passed responsibility elsewhere.",
      evidenceIntro: "For one account to disappear —",
      evidence: [
        { value: "5", unit: "emails", label: "exchanged" },
        { value: "17", unit: "days", label: "until deletion" },
      ],
      questionLabel: "That was when I wondered.",
      question: "Where is my information\nstill left behind?",
      beginning: {
        kicker: "That was the thought.",
        heading: "Maybe this is much harder\nthan one person should have to handle alone.",
        body: "Lethe began with that question.",
      },
    },
    service: {
      label: "How Lethe Helps",
      intro: {
        heading: "What to keep,\nand what to let flow away.",
        body: "Lethe helps people calmly check the digital traces they have left behind, understand them deeply, and choose for themselves.",
      },
      features: [
        {
          heading: "Check",
          body: "Gather scattered accounts in one place.",
        },
        {
          heading: "Understand",
          body: "Understand what information is being used and how.",
        },
        {
          heading: "Organize",
          body: "Choose what to keep and what to let flow away.",
        },
      ],
      visuals: {
        check: {
          services: ["Google", "Naver", "Apple"],
          recent: "Checked 12 days ago",
          needsCheck: "Needs check",
        },
        understand: {
          status: "Needs review",
          scoreUnit: "pts",
          inactive: "Unused for 3 years",
          adProfile: {
            term: "ad profile",
            suffix: " active",
            title: "Ad profile",
            intro: [
              "Services may create a user profile based on usage history and interests.",
              "For example, if you often search for travel, more travel-related ads or recommendations may appear.",
            ],
            whyTitle: "Why know this?",
            why: [
              "This profile can be used to infer what you may be interested in.",
              "It is often used to make ads or recommendations more relevant, but the information used can differ by service.",
            ],
          },
          location: {
            term: "location data",
            suffix: " in use",
            title: "Location data",
            intro: [
              "Services may use your location.",
              "For example, it can be used to show nearby stores or provide local recommendations.",
            ],
            whyTitle: "Why know this?",
            why: [
              "Location data can be useful, but it may also be used to infer patterns in daily life.",
              "It helps to know when and why location data is being used.",
            ],
          },
        },
        organize: {
          keep: "Keep",
          release: "Let flow away",
          unit: "",
        },
      },
    },
    vision: {
      label: "Our Vision",
      heading: "A world where everyone\ncan freely and quietly\ncurate their digital life",
      body: "Without anxiety. Without technical jargon. Just calm clarity.",
    },
    cta: {
      label: "Interview",
      heading: "As drops gather\ninto a river,\nvoices are gathering.",
      body: "Your experience can help build a better digital environment.",
      perks: [
        "I didn't know my information could remain after leaving.",
        "I couldn't remember where I had signed up.",
        "I lost track of how many deletion requests I had sent.",
      ],
      stream: [
        {
          quote: "I didn't know\nmy information could remain.",
          insight: "Disconnecting and deleting\nare not always the same.",
        },
        {
          quote: "I couldn't remember\nwhere I had signed up.",
          insight: "Old accounts can be hard\nto find on your own.",
        },
        {
          quote: "I lost track of how many\ndeletion requests I had sent.",
          insight: "Clearing information can take\nmore time than expected.",
        },
        {
          quote: "Do I really have\nthe right to be forgotten?",
          insight: "A passing question led me to try deleting an account.",
          linkText: "A longer journey began.",
        },
      ],
      button: "Apply for Interview",
      note: "About 30 minutes. Anonymous participation is welcome.",
      transparency: {
        heading: "Lethe only uses the information needed for interview applications on this page.",
        body: "We collect only a name or nickname,\nemail address,\nand application details.\n\nCollected information is used to run interviews\nand for Lethe research and development.\n\nYou can ask us to delete it at any time.",
        button: "View Data Use",
      },
    },
    footer: {
      tagline: "As the river carries it away.",
      rights: "© 2026 Lethe. All rights reserved.",
      privacy: "Data We Use",
      contact: "Contact",
    },
    note01: {
      label: "Lethe Note 01",
      title: "Do I really have\nthe right\nto be forgotten?",
      intro: "A passing question led me to try deleting an account.\nAnd a longer journey than expected began.",
      sections: [
        {
          heading: null,
          body: [
            "I tried to delete one account.",
            "I thought it would be simple — open settings, hit the delete button, confirm. Instead, it took five emails and 17 days until the deletion was complete.",
            "Along the way, I studied GDPR and personal data deletion requests. Most replies were formal instructions or messages that passed responsibility elsewhere.",
          ],
        },
        {
          heading: "Disconnecting and deleting\nare not always the same.",
          body: [
            "For many services, 'leaving' only blocks access to the account — it does not erase the data. In backup servers, with partners, in ad platforms — your traces may still remain somewhere.",
            "Most people don't know that information can remain even after they leave. And fewer still know how to actually remove it.",
          ],
        },
        {
          heading: "I couldn't even remember\nwhere I had signed up.",
          body: [
            "The first thing I ran into when trying to delete was realizing I didn't have a clear picture of which services I'd joined with which email.",
            "Old accounts can be hard to find on your own. Accounts created through social login, services used briefly for a promotion, apps I thought no longer existed — they still held my information somewhere.",
          ],
        },
        {
          heading: "Much harder than one person\nshould have to do alone.",
          body: [
            "Removing information is a question of rights, but it is also a very practical one. Who to contact, what form the request should take, how long to wait — figuring all of this out and following through on your own takes more time and energy than most people expect.",
            "Lethe began with that question.",
          ],
        },
      ],
      cta: {
        heading: "Your experience can be\nthe first current of Lethe.",
        button: "Apply for Interview",
        note: "* About 30 minutes.",
      },
    },
    privacy: {
      title: "How will the information you share be used?",
      subtitle: "(Privacy Policy)",
      easyTab: "Plain language",
      detailTab: "Details",
      close: "Close",
      easy: {
        paragraphs: [
          "Lethe is currently conducting user interviews to develop the service.",
          "We collect only the minimum information needed to run interviews.",
        ],
        collectedTitle: "Information we collect",
        collected: ["Name or nickname", "Email address", "Information written in the interview application"],
        after: [
          "Collected information is used to run interviews and for Lethe research and development.",
          "If you ask us to delete it, the related information will be deleted.",
        ],
        contactTitle: "Contact",
        contact: "connect.lethe@gmail.com",
      },
      detail: {
        heading: "Privacy Policy",
        updated: "Last updated: 2026.06.23",
        sections: [
          {
            title: "Information we collect",
            items: ["Name or nickname", "Email address", "Information users write during the interview application process"],
          },
          {
            title: "Why we use it",
            items: ["Interview scheduling", "Collecting user experience and opinions", "Service research and development"],
          },
          {
            title: "Retention period",
            body: "Collected information is retained for research and interview purposes and deleted without delay in the following cases.",
            items: ["When the research purpose has been achieved", "When the user requests deletion"],
          },
          {
            title: "Third-party sharing",
            body: "Lethe currently uses information within the scope needed for interviews, research, and development. When external services are used, necessary information may be transferred to those services.",
          },
          {
            title: "External services",
            body: "We may use external services such as the following for interview applications and scheduling. Necessary information may be transferred to those services during use.",
            items: ["Google Forms", "Google Calendar", "Calendly"],
          },
          {
            title: "Your rights",
            body: "You may request the following regarding your information at any time.",
            items: ["Access", "Correction", "Deletion"],
          },
        ],
        contactTitle: "Contact",
        contact: "connect.lethe@gmail.com",
      },
    },
  },

  ja: {
    nav: {
      cta: "インタビューに参加",
      privacy: "使う情報",
    },
    hero: {
      title: "LETHE",
      sub1: "川の流れのように。",
    },
    story: {
      label: "はじまり",
      heading: "ひとつのアカウントを\n削除しようとしました。",
      body: "簡単なことだと思っていました。\nしかし実際には5回のメールをやり取りし、\n削除が完了するまで17日かかりました。\n\nその過程で、GDPRと個人情報削除請求について学びました。\n返ってきた答えの多くは形式的な案内か、\n責任を移すような返信でした。",
      evidenceIntro: "ひとつのアカウントが削除されるまで —",
      evidence: [
        { value: "5", unit: "回", label: "やり取りしたメール" },
        { value: "17", unit: "日", label: "削除完了までの時間" },
      ],
      questionLabel: "その時、初めて気になりました。",
      question: "私の情報は今\nどこに残っているのだろう？",
      beginning: {
        kicker: "そう思いました。",
        heading: "個人が一人で行うには\n思ったよりずっと難しいことではないか。",
        body: "Letheはその問いから始まりました。",
      },
    },
    service: {
      label: "Letheが支援すること",
      intro: {
        heading: "何を残し、\n何を流していくのか。",
        body: "Letheは、自分が残したデジタルの痕跡を静かに確認し、深く理解し、自分で選べるよう支援する道具です。",
      },
      features: [
        {
          heading: "確認する",
          body: "散らばったアカウントを集めて確認します。",
        },
        {
          heading: "理解する",
          body: "どんな情報がどのように使われているかを理解します。",
        },
        {
          heading: "整理する",
          body: "残すものと流していくものを選びます。",
        },
      ],
      visuals: {
        check: {
          services: ["Google", "Naver", "Apple"],
          recent: "12日前に確認",
          needsCheck: "確認が必要",
        },
        understand: {
          status: "確認が必要",
          scoreUnit: "点",
          inactive: "3年間使用していません",
          adProfile: {
            term: "広告プロフィール",
            suffix: "提供中",
            title: "広告プロフィール",
            intro: [
              "サービスは利用履歴や関心に基づいてユーザープロフィールを作成することがあります。",
              "たとえば旅行をよく検索している場合、旅行関連の広告やおすすめが多く表示されることがあります。",
            ],
            whyTitle: "なぜ知る必要があるのでしょうか？",
            why: [
              "このプロフィールは、利用者が何に関心を持っているかを推定するために使われることがあります。",
              "多くの場合、広告やおすすめをより関連性の高いものにするためですが、どの情報が使われるかはサービスによって異なります。",
            ],
          },
          location: {
            term: "位置情報",
            suffix: "収集中",
            title: "位置情報",
            intro: [
              "サービスは利用者の位置情報を活用することがあります。",
              "たとえば近くの店舗を表示したり、地域に合わせたおすすめを提供したりする際に使われます。",
            ],
            whyTitle: "なぜ知る必要があるのでしょうか？",
            why: [
              "位置情報は便利ですが、同時に生活パターンを推測するために使われることもあります。",
              "そのため、位置情報がいつ、どのような目的で使われるのかを知っておくことが大切です。",
            ],
          },
        },
        organize: {
          keep: "残すもの",
          release: "流していくもの",
          unit: "件",
        },
      },
    },
    vision: {
      label: "ビジョン",
      heading: "誰もが自分の\nデジタルライフを自由に\n整理できる世界へ",
      body: "不安なく。専門用語なく。ただ、静かに。",
    },
    cta: {
      label: "インタビュー",
      heading: "水滴が集まり\n川になるように、\n声が集まっています。",
      body: "あなたの経験が、よりよいデジタル環境をつくります。",
      perks: [
        "退会後も情報が残るとは知りませんでした。",
        "どこに登録したのかも覚えていませんでした。",
        "削除請求を何度送ったか分かりません。",
      ],
      stream: [
        {
          quote: "退会後も\n情報が残るとは知りませんでした。",
          insight: "連携解除と削除は\nいつも同じ意味ではありません。",
        },
        {
          quote: "どこに登録したのかも\n覚えていませんでした。",
          insight: "古いアカウントは\n自分でも見つけにくいことがあります。",
        },
        {
          quote: "削除請求を何度送ったか\n分かりません。",
          insight: "情報を消すことは\n思ったより時間がかかることがあります。",
        },
        {
          quote: "本当に私は\n忘れられる権利を持っているのか。",
          insight: "ふと思い立ち、アカウントを削除してみることにしました。",
          linkText: "思ったより長い旅が始まりました。",
        },
      ],
      button: "インタビューに申し込む",
      note: "約30分。匿名での参加も可能です。",
      transparency: {
        heading: "Letheは、このページでインタビュー申込に必要な情報だけを使用します。",
        body: "名前またはニックネーム、\nメールアドレス、\n申込内容のみを受け取ります。\n\n収集された情報はインタビュー進行と\nLetheの研究・開発のために使用されます。\n\nいつでも削除を依頼できます。",
        button: "使う情報を見る",
      },
    },
    footer: {
      tagline: "川の流れのように。",
      rights: "© 2026 Lethe. All rights reserved.",
      privacy: "使う情報",
      contact: "お問い合わせ",
    },
    note01: {
      label: "Lethe Note 01",
      title: "本当に私は\n忘れられる権利を\n持っているのか。",
      intro: "ふと思い立ち、アカウントを削除してみることにしました。\nそして、思ったより長い旅が始まりました。",
      sections: [
        {
          heading: null,
          body: [
            "ひとつのアカウントを削除しようとしました。",
            "簡単なことだと思っていました。設定を開いて、削除ボタンを押して、確認すれば終わると思っていました。しかし実際には5回のメールをやり取りし、削除が完了するまで17日かかりました。",
            "その過程で、GDPRと個人情報削除請求について学びました。返ってきた答えの多くは形式的な案内か、責任を移すような返信でした。",
          ],
        },
        {
          heading: "連携解除と削除は\nいつも同じ意味ではありません。",
          body: [
            "多くのサービスで「退会」とはアカウントへのログインを遮断するだけで、データ自体を消すことではありません。バックアップサーバーに、パートナー企業に、広告プラットフォームに — あなたの痕跡はまだどこかに残っているかもしれません。",
            "退会しても情報が残ることを知っている人は多くありません。知っていたとしても、それを実際に消す方法を知っている人はさらに少ないです。",
          ],
        },
        {
          heading: "どこに登録したのかも\n覚えていませんでした。",
          body: [
            "削除を試みて最初に直面したのは、自分がどのサービスにどのメールアドレスで登録したのかを把握できていないという現実でした。",
            "古いアカウントは自分でも見つけにくいことがあります。ソーシャルログインで作ったアカウント、キャンペーンで一時的に使ったサービス、もう存在しないと思っていたアプリ。それらはまだどこかに私の情報を持っていました。",
          ],
        },
        {
          heading: "個人が一人で行うには\n思ったよりずっと難しいこと。",
          body: [
            "情報を消すことは権利の問題であると同時に、とても実践的な問題でもあります。どこに連絡するか、どんな形式でリクエストするか、どのくらい待つか — これらすべてを一人で把握して実行するには、多くの人が想像する以上の時間とエネルギーが必要です。",
            "Letheはその問いから始まりました。",
          ],
        },
      ],
      cta: {
        heading: "あなたの経験も\nLetheの最初の流れになります。",
        button: "インタビューに申し込む",
        note: "* 約30分。",
      },
    },
    privacy: {
      title: "あなたが知らせた情報はどのように使われますか？",
      subtitle: "(プライバシーポリシー)",
      easyTab: "やさしく読む",
      detailTab: "詳しく見る",
      close: "閉じる",
      easy: {
        paragraphs: [
          "Letheは現在、サービス開発のためにユーザーインタビューを行っています。",
          "インタビューを進めるために必要な最小限の情報だけを受け取ります。",
        ],
        collectedTitle: "収集する情報",
        collected: ["名前またはニックネーム", "メールアドレス", "インタビュー申込時に記入した内容"],
        after: [
          "収集された情報はインタビュー進行とLetheの研究・開発のために使用されます。",
          "削除を依頼した場合、関連情報は削除されます。",
        ],
        contactTitle: "お問い合わせ",
        contact: "connect.lethe@gmail.com",
      },
      detail: {
        heading: "プライバシーポリシー",
        updated: "最終更新日: 2026.06.23",
        sections: [
          {
            title: "収集する情報",
            items: ["名前またはニックネーム", "メールアドレス", "インタビュー申込過程でユーザーが直接記入した内容"],
          },
          {
            title: "情報を使用する理由",
            items: ["インタビューの日程調整", "ユーザー体験と意見の収集", "サービス研究と開発"],
          },
          {
            title: "保管期間",
            body: "収集された情報は研究およびインタビュー進行のために保管され、以下の場合には遅滞なく削除されます。",
            items: ["研究目的が達成された場合", "利用者が削除を依頼した場合"],
          },
          {
            title: "第三者提供",
            body: "現在Letheは、インタビュー進行と研究・開発に必要な範囲で情報を使用します。外部サービスを利用する過程で、必要な情報が当該サービスに送信される場合があります。",
          },
          {
            title: "外部サービスの利用",
            body: "インタビュー申込および日程調整の過程で、以下のような外部サービスを利用することがあります。利用過程で必要な情報が当該サービスに送信される場合があります。",
            items: ["Google Forms", "Google Calendar", "Calendly"],
          },
          {
            title: "利用者の権利",
            body: "利用者はいつでも自分の情報について以下を請求できます。",
            items: ["閲覧", "修正", "削除"],
          },
        ],
        contactTitle: "お問い合わせ",
        contact: "connect.lethe@gmail.com",
      },
    },
  },
} as const;

export type Translations = (typeof translations)[Locale];

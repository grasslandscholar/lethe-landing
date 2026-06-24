"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PrivacyModal from "@/components/PrivacyModal";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";

const INTERVIEW_FORM_URLS = {
  ko: "https://forms.gle/eJyygJXEwKfLWgPR8",
  en: "https://forms.gle/rxVPZWnhXr2xQBgd8",
  ja: "https://forms.gle/nijRn2Tbdo7Ggb5u7",
} as const;

const CONTENT = {
  ko: {
    conclusionHeading: "결론부터 말씀드리자면, 다음과 같습니다.",
    stat1Label: "소요 시간",
    stat2Label: "주고받은 이메일",
    stat3a: "확인",
    stat3b: "불가",
    stat3Label: "삭제 여부 불명",
    p1: "처음에는 단순한 일이라고만 생각했습니다.",
    p2: "계정을 찾고, 탈퇴하고, 개인정보 삭제 요청을 하면 끝날 줄로만 알았습니다.",
    but: "하지만...",
    list: [
      "답장을 기다리고,",
      "다시 메일을 보내고,",
      "또 기다리는 시간이 반복되었습니다.",
      "최종적으로는 17일이 걸렸습니다.",
    ],
    p3: "더욱 씁쓸한 점은, 정말 삭제되었는지 확인할 방법이 없다는 점이었습니다.",
    p4: "'계정이 성공적으로 탈퇴되었다'라는 문장을 받았지만, 저는 그 말을 믿는 것 외에는 할 수 있는 것이 없었습니다.",
    s2p1: "이토록 2주일이 넘는 시간 동안, 머릿속으로는 하나의 생각이 스쳐가기 시작했습니다.",
    blockquote: "\"정말 우리는 잊힐 권리를\n가지고 있는가?\"",
    s2p2: "잠시 시간을 내어 검색해보니, 각 사이트에서 마련하는 개인정보처리방침, 그리고 일반정보보호규정 GDPR 등 여러 장치들이 마련되어 있다고 합니다.",
    s2p3: "하지만 안타깝게도 이번 여정에서는 개인정보와 보호 사이의 거리는 참으로 멀다고만 느껴졌습니다.",
    s2p4: "애초에 내가 개인 정보를 준 순간부터, '소중한 내 정보'라는 개념은 시간의 지평선 너머로 사라져버린 게 아닐까 하고요.",
    s2p5: "조금은 무섭고, 어딘가 불편한 주제입니다.",
    s2p6: "저를 포함한 대부분은, 그저 그런 장치들이 있으니 소중한 내 정보도 잘 보호받고 있겠지라는 '믿음'으로 지금까지 지내왔으니까요.",
    s2p7: "하지만 '정말 그런가?'라는 의문에서 시작한 계정 삭제 실험은, 안타깝게도 사실 이 모든 게 허상일지도 모른다는 경각심으로 이어졌습니다.",
    corpMain: "그 이후로도 실험을 진행했고, 상당히 신뢰하고 있었던 한 대기업으로부터는 개인정보 열람을 요청했지만...",
    corpCont: "약 3주가 지난 지금, 이 글을 쓰는 순간에도 열람조차 하지 못하고 있습니다.",
    pullquoteMain: "분명 권리는 존재합니다.",
    pullquoteSub: "하지만...",
    bold: "권리를 행사하는 것은 생각보다 어렵습니다.",
    s3p1: "무엇을 요청해야 하는지, 누구에게 요청해야 하는지, 어떤 절차를 따라야 하는지 모른다면 성공적으로 원하는 것을 얻어내기까진 참으로 어려울 것입니다.",
    s3p2: "마치 법정에서의 일들이 그러합니다.",
    lawyerMain: "나를 보호해줄 법, 이 억울함을 풀어줄 법이 있더라도...",
    lawyerCont: "이 마음을 주장해줄 변호사가 없다면 말할 수 없는 것처럼요.",
    s3p3: "목소리도, 의지도 있지만, 어떻게 해야 하는지를 모르면, 법정 언어와 절차를 모르면 우리는 그저 억울한 사람으로만 남습니다.",
    s3p4: "세상이 많이 발전한다면 언젠가 이런 고민을 할 필요도 없는 순간이 올 수도 있겠지만, 적어도 현재와 미래 사이의 과도기에 살아가는 우리는 여전히 고민해야 한다고 생각합니다.",
    s3p5: "다른 누구도 아닌, 소중한 나 자신을 위하여.",
    nextLabel: "다음 노트에서는",
    nextBody: "기존 개인정보 보호 서비스가 존재함에도, 왜 저는 밤을 새며 직접 계정을 찾고 삭제하고 있었을까요.",
    nextEnd: "Data Broker Problem에서\nAccount Discovery Problem으로.",
  },
  en: {
    conclusionHeading: "Let me begin with the conclusion.",
    stat1Label: "Days spent",
    stat2Label: "Emails exchanged",
    stat3a: "No way",
    stat3b: "to verify",
    stat3Label: "Deletion unverifiable",
    p1: "At first, I thought it would be simple.",
    p2: "Find the account, close it, submit a data deletion request — and that would be the end of it.",
    but: "But...",
    list: [
      "Waiting for a reply,",
      "Sending another email,",
      "The cycle of waiting repeated.",
      "In the end, it took 17 days.",
    ],
    p3: "What made it more disheartening was that there was no way to verify whether my data had actually been deleted.",
    p4: "I received a message saying 'Your account has been successfully deleted,' but there was nothing I could do except take those words on faith.",
    s2p1: "Throughout those two-plus weeks, one thought kept drifting through my mind.",
    blockquote: "\"Do we truly have\nthe right to be forgotten?\"",
    s2p2: "After some research, I found that various protections exist — privacy policies maintained by each platform, the General Data Protection Regulation (GDPR), and more.",
    s2p3: "But unfortunately, throughout this journey, the distance between personal data and its protection felt vast.",
    s2p4: "Perhaps from the very moment we hand over our data, the idea of 'my precious information' quietly drifts beyond the horizon.",
    s2p5: "It's a somewhat frightening, quietly unsettling topic.",
    s2p6: "Most of us — myself included — have lived until now with the quiet belief that because these protections exist, our data must be safe.",
    s2p7: "But this experiment, born from asking 'Is that really true?', led — sadly — to a dawning awareness that all of this might be an illusion.",
    corpMain: "I continued the experiment, and from a company I trusted considerably, I submitted a request to access my personal data — but...",
    corpCont: "Even now, three weeks later, as I write these words, I have yet to receive access.",
    pullquoteMain: "The right clearly exists.",
    pullquoteSub: "And yet...",
    bold: "Exercising that right is harder than you might think.",
    s3p1: "If you don't know what to request, who to ask, or what procedure to follow, successfully obtaining what you want proves remarkably difficult.",
    s3p2: "Much like what happens in a courtroom.",
    lawyerMain: "Even if there's a law to protect you, a law to right this injustice...",
    lawyerCont: "Without a lawyer to voice your case, you cannot speak.",
    s3p3: "You have a voice and the will — but if you don't know how, if you don't speak the language and know the procedures of the courtroom, you remain nothing more than someone with an unheard grievance.",
    s3p4: "As the world advances, there may come a day when none of this requires thought. But at least those of us living through this transition between now and that future must still grapple with it.",
    s3p5: "For no one else — for yourself.",
    nextLabel: "In the next note",
    nextBody: "Despite existing privacy protection services, why was I still staying up nights, finding and deleting accounts myself.",
    nextEnd: "From Data Broker Problem\nto Account Discovery Problem.",
  },
  ja: {
    conclusionHeading: "結論から申し上げると、以下の通りです。",
    stat1Label: "所要日数",
    stat2Label: "メールのやり取り",
    stat3a: "確認",
    stat3b: "不可",
    stat3Label: "削除の確認手段なし",
    p1: "最初は単純なことだと思っていました。",
    p2: "アカウントを見つけて、退会して、個人情報の削除を申請すれば終わるはずでした。",
    but: "しかし...",
    list: [
      "返信を待ち、",
      "再びメールを送り、",
      "また待つ時間が繰り返されました。",
      "最終的に17日かかりました。",
    ],
    p3: "さらに悔しかったのは、本当に削除されたかどうか確認する方法がないということでした。",
    p4: "「アカウントが正常に退会されました」というメッセージを受け取りましたが、その言葉を信じる以外にできることはありませんでした。",
    s2p1: "そんな2週間余りの間、頭の中で一つの思いがよぎり続けました。",
    blockquote: "\"本当に私たちは\n忘れられる権利を持っているのか？\"",
    s2p2: "少し調べてみると、各サービスが設けるプライバシーポリシー、そして一般データ保護規則（GDPR）など、さまざまな仕組みが整えられているとのことです。",
    s2p3: "しかし残念ながら、今回の経験では個人情報と保護の間の距離は非常に遠いと感じました。",
    s2p4: "そもそも個人情報を渡した瞬間から、「大切な自分の情報」という概念は、時間の地平線の彼方へ消えてしまったのではないかと。",
    s2p5: "少し怖く、どこか不快な話題です。",
    s2p6: "私を含めた多くの人は、そういった仕組みがあるから自分の大切な情報もきちんと守られているだろうという「信頼」のもとでここまで過ごしてきたのですから。",
    s2p7: "しかし「本当にそうなのか？」という疑問から始めたアカウント削除の実験は、残念ながら、これらすべてが幻想かもしれないという危機感へとつながりました。",
    corpMain: "その後も実験を続け、かなり信頼していた大手企業に個人情報の開示を請求しましたが...",
    corpCont: "3週間ほど経った今、この記事を書いているこの瞬間も、まだ開示すら受けられていません。",
    pullquoteMain: "確かに権利は存在します。",
    pullquoteSub: "しかし...",
    bold: "その権利を行使することは、思っているより難しいのです。",
    s3p1: "何を請求すべきか、誰に請求すべきか、どんな手続きを踏むべきかがわからなければ、望む結果を得ることは非常に困難です。",
    s3p2: "法廷での出来事もそうです。",
    lawyerMain: "自分を守る法律、この理不尽を解決してくれる法律があったとしても...",
    lawyerCont: "その主張を代わりに述べてくれる弁護士がいなければ、声を上げることすらできないように。",
    s3p3: "声も意志もあるのに、どうすればいいかわからなければ、法廷の言語と手続きを知らなければ、私たちはただ理不尽を抱えた者として残るだけです。",
    s3p4: "世の中が大きく進歩すれば、いつかこんなことを考える必要もない日が来るかもしれません。しかし少なくとも、現在と未来の間の過渡期を生きる私たちは、まだ考え続けなければならないと思います。",
    s3p5: "ほかの誰でもない、大切な自分自身のために。",
    nextLabel: "次のノートでは",
    nextBody: "既存のプライバシー保護サービスがあるにもかかわらず、なぜ私は夜を明かして自らアカウントを探し、削除していたのでしょうか。",
    nextEnd: "Data Broker Problemから\nAccount Discovery Problemへ。",
  },
} as const;

function Continuation({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 pl-5 border-l border-[#d4cdc4] text-[#7f8c8d] text-sm md:text-base leading-7">
      {children}
    </p>
  );
}

function SectionDivider() {
  return <div className="border-t border-[#e8e0d5] my-16" />;
}

export default function NoteClient() {
  const { locale, t } = useLanguage();
  const note = t.note01;
  const c = CONTENT[locale];
  const interviewFormUrl = INTERVIEW_FORM_URLS[locale];

  return (
    <>
      <Navigation forceScrolled />
      <main className="min-h-screen bg-[#faf8f4] text-[#2c3e50]">

        {/* Header */}
        <div className="max-w-2xl mx-auto px-6 md:px-8 pt-36 md:pt-44 pb-16">
          <FadeInWhenVisible>
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#7f8c8d]">
              {note.label}
            </span>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={80}>
            <h1 className="mt-8 font-display font-light text-5xl md:text-7xl leading-[1.1] text-[#2c3e50] whitespace-pre-line">
              {note.title}
            </h1>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={180}>
            <p className="mt-10 text-base md:text-lg leading-8 text-[#7f8c8d] max-w-prose whitespace-pre-line">
              {note.intro}
            </p>
          </FadeInWhenVisible>
        </div>

        {/* Divider */}
        <div className="max-w-2xl mx-auto px-6 md:px-8">
          <div className="border-t border-[#e8e0d5]" />
        </div>

        {/* River image */}
        <FadeInWhenVisible>
          <div className="max-w-2xl mx-auto px-10 md:px-16 pt-10">
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src="/images/note-river.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
          </div>
        </FadeInWhenVisible>

        {/* Article */}
        <article className="max-w-2xl mx-auto px-6 md:px-8 pt-8 pb-16 md:pb-24">

          {/* Section 1: 결론부터 */}
          <FadeInWhenVisible>
            <section className="space-y-6 pt-10">
              <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50] font-semibold text-center">
                {c.conclusionHeading}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 py-8">
                <div className="text-center">
                  <p className="font-display text-4xl md:text-5xl font-light text-[#2c3e50]">
                    17<span className="text-lg md:text-xl ml-0.5 text-[#7f8c8d]">{locale === "en" ? "d" : locale === "ja" ? "日" : "일"}</span>
                  </p>
                  <p className="text-[11px] text-[#a09890] mt-3 tracking-wide">{c.stat1Label}</p>
                </div>
                <div className="text-center border-x border-[#e8e0d5]">
                  <p className="font-display text-4xl md:text-5xl font-light text-[#2c3e50]">
                    5<span className="text-lg md:text-xl ml-0.5 text-[#7f8c8d]">{locale === "en" ? "×" : locale === "ja" ? "回" : "번"}</span>
                  </p>
                  <p className="text-[11px] text-[#a09890] mt-3 tracking-wide">{c.stat2Label}</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-2xl md:text-3xl font-light text-[#7f8c8d] leading-tight">
                    {c.stat3a}<br />{c.stat3b}
                  </p>
                  <p className="text-[11px] text-[#a09890] mt-3 tracking-wide">{c.stat3Label}</p>
                </div>
              </div>

              <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">{c.p1}</p>
              <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">{c.p2}</p>
              <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">{c.but}</p>

              <ol className="space-y-4">
                {c.list.map((item, i) => (
                  <li key={i} className="flex gap-5 text-base md:text-lg leading-8 text-[#2c3e50]">
                    <span className="font-display text-2xl font-light text-[#c8c0b0] shrink-0 w-5 text-right">{i + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>

              <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">{c.p3}</p>
              <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">{c.p4}</p>
            </section>
          </FadeInWhenVisible>

          <SectionDivider />

          {/* Section 2: 잊힐 권리 */}
          <FadeInWhenVisible>
            <section className="space-y-6">
              <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">{c.s2p1}</p>

              <blockquote className="py-2 pl-5 border-l-2 border-[#2c3e50]">
                <p className="font-display font-light text-2xl md:text-3xl leading-snug text-[#2c3e50] whitespace-pre-line">
                  {c.blockquote}
                </p>
              </blockquote>

              <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">{c.s2p2}</p>
              <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">{c.s2p3}</p>
              <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">{c.s2p4}</p>
              <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">{c.s2p5}</p>
              <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">{c.s2p6}</p>
              <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">{c.s2p7}</p>

              <div className="pt-4">
                <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">{c.corpMain}</p>
                <Continuation>{c.corpCont}</Continuation>
              </div>
            </section>
          </FadeInWhenVisible>

          {/* Section 3: 권리는 존재합니다 */}
          <FadeInWhenVisible>
            <section className="space-y-6">

              {/* Pullquote */}
              <div className="py-16 border-t border-[#e8e0d5] mt-16">
                <p className="font-display font-light text-3xl md:text-4xl leading-snug text-[#2c3e50]">
                  {c.pullquoteMain}
                </p>
                <p className="font-display font-light text-3xl md:text-4xl leading-snug text-[#7f8c8d] mt-2">
                  {c.pullquoteSub}
                </p>
              </div>

              <div className="border-t border-[#e8e0d5] pt-8 mb-2">
                <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50] font-bold">
                  {c.bold}
                </p>
              </div>

              <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">{c.s3p1}</p>
              <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">{c.s3p2}</p>

              <div>
                <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">{c.lawyerMain}</p>
                <Continuation>{c.lawyerCont}</Continuation>
              </div>

              <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">{c.s3p3}</p>
              <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">{c.s3p4}</p>
              <p className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">{c.s3p5}</p>

              {/* Lethe mark */}
              <div className="flex justify-center pt-10 pb-2">
                <Image
                  src="/brand/lethe-black-mark.png"
                  alt="Lethe"
                  width={32}
                  height={32}
                  className="opacity-25"
                />
              </div>
            </section>
          </FadeInWhenVisible>

          <SectionDivider />

          {/* Section 4: 다음 노트 예고 */}
          <FadeInWhenVisible>
            <section className="mt-4">
              <div className="border border-[#e8e0d5] bg-[#f6f3ed] px-6 py-6 space-y-3">
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#a09890]">
                  {c.nextLabel}
                </span>
                <p className="text-sm leading-7 text-[#7f8c8d]">
                  {c.nextBody}
                </p>
                <p className="font-display font-light text-base md:text-lg text-[#2c3e50] pt-1 whitespace-pre-line">
                  {c.nextEnd}
                </p>
              </div>
            </section>
          </FadeInWhenVisible>

        </article>

        {/* Divider */}
        <div className="max-w-2xl mx-auto px-6 md:px-8">
          <div className="border-t border-[#e8e0d5]" />
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto px-6 md:px-8 py-24 md:py-32">
          <FadeInWhenVisible>
            <p className="font-display font-light text-3xl md:text-4xl leading-snug text-[#2c3e50] whitespace-pre-line">
              {note.cta.heading}
            </p>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={100}>
            <a
              href={interviewFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex min-h-12 items-center justify-center bg-[#2c3e50] px-9 py-4 text-sm tracking-[0.16em] text-[#faf8f4] transition-all duration-300 hover:bg-[#1a2a38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2c3e50] focus-visible:outline-offset-4"
            >
              {note.cta.button}
            </a>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={160}>
            <p className="mt-6 text-xs tracking-wide text-[#7f8c8d]">{note.cta.note}</p>
          </FadeInWhenVisible>
        </div>

      </main>
      <Footer />
      <PrivacyModal />
    </>
  );
}

import svgPaths from "./svg-0m6vwriqrf";
import imgCard from "@/assets/e3dec1cff3f99e02403f915c26ff16944053aa4f.png";
import imgImage1 from "@/assets/67c412c753b615eb7e43abeb1557c645e4c4b0b9.png";

function Frame1() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-[16px] top-[19px]">
      <p className="css-ew64yg font-['AvertaStd-Black:☞',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#071074] text-[24px]">Productr</p>
      <div className="h-[26.639px] relative shrink-0 w-[26.656px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.6561 26.6392">
          <path d={svgPaths.p3f69e148} fill="var(--fill-0, #FF662B)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Card">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center pb-[20px] pt-0 px-[20px] relative size-full">
          <div className="absolute h-[118px] left-[calc(50%+3.04px)] mix-blend-plus-lighter top-[21px] translate-x-[-50%] w-[266.083px]">
            <div className="absolute inset-[-84.75%_-37.58%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 466.083 318">
                <g filter="url(#filter0_f_1_410)" id="Ellipse 2" style={{ mixBlendMode: "plus-lighter" }}>
                  <path d={svgPaths.p17e31000} fill="var(--fill-0, white)" fillOpacity="0.4" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="318" id="filter0_f_1_410" width="466.083" x="0" y="0">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                    <feGaussianBlur result="effect1_foregroundBlur_1_410" stdDeviation="50" />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="relative shrink-0 w-full" data-name="Text">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[20px] py-0 relative w-full">
          <div className="css-g0mm18 font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[19px] text-center text-white">
            <p className="css-ew64yg mb-0">{`Uplist your `}</p>
            <p className="css-ew64yg">product to market</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="backdrop-blur-[50px] flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Card">
      <div className="flex flex-col items-center justify-end overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center justify-end p-[40px] relative size-full">
          <Text />
        </div>
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="absolute h-[480px] left-1/2 rounded-[48px] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[312px]" data-name="Card">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[48px] size-full" src={imgCard} />
      <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[inherit] size-full">
        <Card />
        <Card1 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[rgba(255,255,255,0.4)] border-solid inset-0 pointer-events-none rounded-[48px] shadow-[0px_8px_34px_0px_rgba(0,0,0,0.32)]" />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute border border-[#d4d4d4] border-solid h-[960px] left-[32px] overflow-clip rounded-[32px] top-[32px] w-[690px]" style={{ backgroundImage: "linear-gradient(rgb(1, 8, 96) 0%, rgb(0, 34, 131) 19.231%, rgb(115, 74, 163) 38.462%, rgb(231, 149, 156) 57.212%, rgb(228, 161, 130) 76.923%, rgb(191, 54, 19) 100%)" }}>
      <div className="absolute h-[1088.096px] left-[-1px] mix-blend-hard-light opacity-95 top-[calc(50%+28.05px)] translate-y-[-50%] w-[981px]" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
      <Frame1 />
      <Card2 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-white h-[40px] relative rounded-[8px] shrink-0 w-full">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[12px] not-italic text-[#98a2b3] text-[14px] top-[calc(50%-8px)]">Enter email or phone number</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d4d4d4] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-start left-[171px] top-[271px] w-[376px]">
      <p className="css-4hzbpn font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-black w-full">Email or Phone number</p>
      <Frame2 />
    </div>
  );
}

function Group() {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Group 2">
          <circle cx="1" cy="1" fill="var(--fill-0, #D4D4D4)" fillOpacity="0.4" id="Ellipse 3" r="1" />
          <circle cx="1" cy="15" fill="var(--fill-0, #D4D4D4)" fillOpacity="0.4" id="Ellipse 5" r="1" />
          <circle cx="15" cy="1" fill="var(--fill-0, #D4D4D4)" fillOpacity="0.4" id="Ellipse 4" r="1" />
          <circle cx="15" cy="15" fill="var(--fill-0, #D4D4D4)" fillOpacity="0.4" id="Ellipse 6" r="1" />
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
      {[...Array(14).keys()].map((_, i) => (
        <Group key={i} />
      ))}
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-1/2 top-[calc(50%-1px)] translate-x-[-50%] translate-y-[-50%] w-[380px]">
      {[...Array(5).keys()].map((_, i) => (
        <Frame7 key={i} />
      ))}
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-center justify-center leading-[16px] left-1/2 not-italic text-[14px] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[202px]">
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#98a2b3] w-full">{`Don’t have a Productr Account `}</p>
      <p className="css-4hzbpn font-['Inter:Medium',sans-serif] font-medium relative shrink-0 text-[#071074] text-center w-full">SignUp Here</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute bg-white border border-[#d4d4d4] border-solid h-[80px] left-[171px] overflow-clip rounded-[8px] top-[834px] w-[376px]">
      <Frame9 />
      <Frame8 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute bg-[#071074] h-[40px] left-[171px] overflow-clip rounded-[8px] top-[360px] w-[376px]">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[calc(50%-18px)] not-italic text-[14px] text-white top-[calc(50%-8px)]">Login</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute h-[1024px] overflow-clip right-0 top-0 w-[718px]">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[calc(50%+0.5px)] not-italic text-[#111652] text-[24px] text-center top-[202px] translate-x-[-50%]">Login to your Productr Account</p>
      <Frame4 />
      <Frame6 />
      <Frame5 />
    </div>
  );
}

export default function Login() {
  return (
    <div className="bg-[#f7f8fa] relative size-full" data-name="Login">
      <Frame />
      <Frame3 />
    </div>
  );
}
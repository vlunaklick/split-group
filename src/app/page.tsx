import { Announcement } from '@/components/home/announcement'
import { FaqPage } from '@/components/home/faq'
import { SiteFooter } from '@/components/home/site-footer'
import { SiteHeader } from '@/components/home/site-header'
import { TrustedBy } from '@/components/home/trusted-by'
import { BorderBeam } from '@/components/magicui/border-beam'
import WordRotate from '@/components/magicui/word-rotate'

export default function Home () {
  return (
    <div className='flex-col dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] z-0"></div>

      <SiteHeader />
      <div className="flex flex-col items-start gap-6 mt-20 px-7 text-center md:items-center z-10">
        <Announcement />
        <h1 className="relative mx-0 max-w-[43.5rem] text-balance bg-gradient-to-br from-black from-50% to-neutral-200/60 bg-clip-text pt-5 text-left text-5xl font-semibold tracking-tighter text-transparent sm:text-7xl md:mx-auto md:px-4 md:py-2 md:text-center md:text-7xl lg:text-7xl dark:text-white">
          Organiza tus gastos de forma <WordRotate words={['inteligente', 'eficiente', 'sencilla']} />
        </h1>
        <p className="max-w-xl text-balance text-left text-base tracking-tight md:text-center md:text-lg dark:font-medium text-primary">
          Con nuestra aplicación podrás llevar un control de tus gastos de forma sencilla y eficiente. ¡Empieza a organizar tus gastos hoy!
        </p>

        <TrustedBy />

        <div className="relative rounded-xl mx-auto justify-center flex flex-col items-center lg:max-w-[1000px] overflow-hidden border border-transparent">

          <img src="/dashboard-dark.png" alt="Hero Image" className="hidden lg:max-w-[1000px] rounded-[inherit] border object-contain shadow-lg dark:block overflow-hidden md:overflow-auto lg:overflow-auto" />

          <img src="/dashboard-light.png" alt="Hero Image" className="block lg:max-w-[1000px] rounded-[inherit] border object-contain shadow-lg dark:hidden overflow-hidden md:overflow-auto lg:overflow-auto" />

          <BorderBeam size={250} duration={12} delay={9} colorFrom='#3b82f6' colorTo='#581c87' anchor={4} />
        </div>

        <FaqPage />
      </div>

      <SiteFooter />
    </div>
  )
}

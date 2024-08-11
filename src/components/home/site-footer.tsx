import { Logo } from "../logo"

export const SiteFooter = () => {
  return (
    <footer className="z-20">
      <div className="container pt-16">
        <div className="mt-10 py-10 border-t items-center justify-between sm:flex">
            <Logo />
            <p className="text-muted-foreground mt-3">Split Group</p>
        </div>
      </div>
    </footer>
  )
}
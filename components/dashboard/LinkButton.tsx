import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, History, PlusCircle } from "lucide-react"
import { ReactNode } from "react"

interface props {
    children : ReactNode,
    url:string,
    buttonVarient?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link",
    className?:string
}

const LinkButton = ({children,url,buttonVarient="ghost",className}:props) => {
    return (
        <Link href={url} >
            <Button variant={buttonVarient} className={`w-full justify-start gap-2 ${className}`}>
                {children}
            </Button>
        </Link>
    );
}

export default LinkButton;
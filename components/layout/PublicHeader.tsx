"use client";

import { Lock, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useState } from "react";

export function PublicHeader() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                {/* Logo / Brand */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <Lock className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-semibold text-foreground">DID Annuaire</span>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden items-center gap-1 md:flex">
                    <Button variant="ghost" asChild>
                        <Link href="/register">Register Organization</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="/verify">Verify DID</Link>
                    </Button>
                </nav>

                {/* Desktop Login Button */}
                <div className="hidden items-center gap-2 md:flex">
                    <Button variant="ghost" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                </div>

                {/* Mobile Menu Trigger */}
                <div className="flex bg-background md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetHeader>
                                <SheetTitle className="text-left">Menu</SheetTitle>
                            </SheetHeader>
                            <div className="mt-8 flex flex-col gap-4">
                                <Button variant="ghost" asChild onClick={() => setIsOpen(false)} className="justify-start">
                                    <Link href="/register">Register Organization</Link>
                                </Button>
                                <Button variant="ghost" asChild onClick={() => setIsOpen(false)} className="justify-start">
                                    <Link href="/verify">Verify DID</Link>
                                </Button>
                                <div className="my-2 border-t border-border" />
                                <Button variant="outline" asChild onClick={() => setIsOpen(false)} className="justify-start">
                                    <Link href="/login">Login</Link>
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

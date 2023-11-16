"use client";

import { useState } from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutButton } from "./LogOutButton";
import { ThemeToggle } from "./theme-toggle";

const NavBar = (user: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();

  return (
    <>
      <div className="hidden md:block">
        <Link
          href="/admin"
          className="md:absolute md:top-0 md:left-0 lg:absolute lg:top-0 lg:left-0"
        >
          <Avatar className="relative top-3 left-10 z-50">
            <AvatarImage src="/images/logo.png" alt="unab" />
          </Avatar>
        </Link>
      </div>

      <Navbar onMenuOpenChange={setIsMenuOpen} isBordered className="relative">
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
        </NavbarContent>
        <NavbarBrand className="block md:hidden lg:hidden">
          <Link href="/admin">
            <Avatar>
              <AvatarImage src="/images/logo.png" alt="unab" />
            </Avatar>
          </Link>
        </NavbarBrand>

        <NavbarContent
          className="hidden md:absolute md:flex left-0 top-0 gap-4 pl-[200px]"
          justify="start"
        >
          <NavbarItem>
            <Link
              href="/admin/"
              className={`text-xl ${
                pathname === "/admin/" ? "text-red-600" : "foreground"
              }`}
            >
              Inicio
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link
              href="/admin/users"
              className={`text-xl ${
                pathname === "/admin/users" ? "text-red-600" : "foreground"
              }`}
            >
              Usuarios
            </Link>
          </NavbarItem>

          {user.user.role !== "ADMIN" && (
            <>
              <NavbarItem>
                <Link
                  href="/admin/laboratories"
                  className={`text-xl ${
                    pathname === "/admin/laboratories"
                      ? "text-red-600"
                      : "foreground"
                  }`}
                >
                  Laboratorios
                </Link>
              </NavbarItem>

              <NavbarItem>
                <Link
                  href="/admin/records"
                  className={`text-xl ${
                    pathname === "/admin/records"
                      ? "text-red-600"
                      : "foreground"
                  }`}
                >
                  Prestamos
                </Link>
              </NavbarItem>
            </>
          )}
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <div className="flex lg:hidden md:hidden gap-3">
              <ThemeToggle />
              <LogOutButton />
            </div>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          <NavbarMenuItem>
            <Link
              href="/admin/"
              className={`text-xl ${
                pathname === "/admin/" ? "text-red-600" : "foreground"
              }`}
            >
              Inicio
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              href="/admin/users"
              className={`text-xl ${
                pathname === "/admin/users" ? "text-red-600" : "foreground"
              }`}
            >
              Usuarios
            </Link>
          </NavbarMenuItem>

          {user.user.role !== "ADMIN" && (
            <>
              <NavbarMenuItem>
                <Link
                  href="/admin/laboratories"
                  className={`text-xl ${
                    pathname === "/admin/laboratories"
                      ? "text-red-600"
                      : "foreground"
                  }`}
                >
                  Laboratorios
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link
                  href="/admin/records"
                  className={`text-xl ${
                    pathname === "/admin/records"
                      ? "text-red-600"
                      : "foreground"
                  }`}
                >
                  Prestamos
                </Link>
              </NavbarMenuItem>
            </>
          )}
        </NavbarMenu>
      </Navbar>

      <div className="hidden lg:block md:block absolute top-0 right-0">
        <div className="relative top-3 right-10 z-50">
          <div className="flex gap-3 items-center">
            <p>{user.user.name}</p>
            <ThemeToggle />
            <LogOutButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;

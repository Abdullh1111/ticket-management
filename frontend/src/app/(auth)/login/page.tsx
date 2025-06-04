/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { LoginForm } from "@/components/auth/LoginForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="relative w-full h-full hidden lg:block">
          <Image
            src="/auth.jpg"
            alt="Professional workspace"
            fill
            className="object-cover rounded-xl shadow-2xl"
            priority
          />
          <div className="absolute inset-0 bg-black/30 rounded-xl" />
        </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Login your account
            </h1>
          </div>

          <Card className="p-6 shadow-sm">
            <LoginForm /> 
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 mx-auto">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Sign Up
              </Link>
            </p>       
          </Card>
        </div>
      </div>
    </div>
  );
}
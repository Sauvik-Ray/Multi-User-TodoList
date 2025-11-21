import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

export default function Landing() {
  return (
    <AppLayout>
      <div
        className="min-h-[80vh] flex items-center justify-center p-6
        bg-gradient-to-b from-background to-muted/40
        dark:from-[#080808] dark:to-[#111]"
      >
        <Card
          className="w-full max-w-xl 
          rounded-3xl shadow-2xl
          border border-white/10
          backdrop-blur-md
          bg-white/70 dark:bg-[#10151f]/70
          transition-all"
        >
          <CardHeader className="text-center space-y-3 pt-8">
            <CardTitle
              className="text-4xl font-extrabold tracking-tight 
              bg-clip-text text-transparent 
              bg-gradient-to-r from-indigo-400 via-purple-500 to-fuchsia-500"
            >
              Collaborate. Organize. Execute.
            </CardTitle>

            <p className="text-sm text-muted-foreground dark:text-gray-300">
              A shared workspace for real-time to-do management.
            </p>
          </CardHeader>

          <CardContent className="pt-2 pb-10">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Link to="/create" className="w-full sm:w-auto">
                <Button
                  className="w-full py-5 font-semibold tracking-wide
                  bg-gradient-to-r from-indigo-500 to-purple-500
                  hover:from-indigo-600 hover:to-purple-600
                  shadow-lg hover:shadow-xl
                  text-white transition-all"
                >
                  Create Room
                </Button>
              </Link>

              <Link to="/join" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full py-5 font-semibold tracking-wide
                  border-purple-500 text-purple-600 
                  hover:bg-purple-500/15 hover:text-purple-800
                  dark:border-purple-400 dark:text-purple-300 
                  dark:hover:bg-purple-500/20 dark:hover:text-white
                  transition-all"
                >
                  Join Room
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

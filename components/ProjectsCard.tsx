import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FramerWrapper from "./animation/FramerWrapper";
import { ArrowUpRight } from "lucide-react";
import LocaleLink from '@/components/LocaleLink';

const ProjectCards: React.FC<any> = ({ value, num, dict }) => {
  return (
    <FramerWrapper
      className="md:w-1/2 xl:w-1/3 px-2 mb-4"
      delay={Math.min(num * 0.05, 0.3)}
    >
      <Card className="w-full h-full flex flex-col shadow-none hover:shadow-lg transition-all duration-300 border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-primary break-all">
            <LocaleLink href={`/blog/${value.id}`} target="_blank"><span dangerouslySetInnerHTML={{ __html: value.post_title }}></span></LocaleLink>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="grow flex flex-col gap-4">
          <p className="text-sm text-muted-foreground leading-relaxed wrap-break-word" dangerouslySetInnerHTML={{ __html: value.post_content_preview }}></p>
        </CardContent>
        
        <CardFooter className="pt-2 ">
          <LocaleLink href={`/blog/${value.id}`} target="_blank"
            className={cn(
              buttonVariants({ 
                variant: "default", 
                size: "sm" 
              }),
              "w-fit transition-all hover:-translate-y-[2] hover:shadow-md group"
            )}
          >
            { dict?.buttons.detail }
            <ArrowUpRight className="h-4 w-4 ml-1 hidden group-hover:block -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
          </LocaleLink>
        </CardFooter>
      </Card>
    </FramerWrapper>
  );
};

export default ProjectCards;

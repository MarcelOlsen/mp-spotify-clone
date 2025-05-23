import { Header } from "@/components/header";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

const HomeLayout = ({ children }: Props) => {
    return (
        <div className="w-full ">
            <Header>{children}</Header>
        </div>
    );
};

export default HomeLayout;

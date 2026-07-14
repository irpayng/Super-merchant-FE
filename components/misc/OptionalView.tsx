import React from "react";

type Props = {
	condition: boolean;
	children: React.ReactNode;
};

const OptionalView = ({ condition, children }: Props) => {
	return condition ? <>{children}</> : null;
};

export default OptionalView;

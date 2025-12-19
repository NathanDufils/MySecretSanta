import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    const { className, ...rest } = props;
    return (
        <img
            src="/logo-icon.png"
            alt="Logo Icon"
            className={className}
            {...rest}
        />
    );
}

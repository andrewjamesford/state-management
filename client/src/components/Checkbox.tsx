import type React from "react";
import PropTypes from 'prop-types';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	labelClassName?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
	label,
	labelClassName = "",
	id,
	...props
}) => {
	return (
		<div className="flex items-center">
			<input type="checkbox" id={id} {...props} className="mr-2" />
			{label && (
				<label htmlFor={id} className={labelClassName}>
					{label}
				</label>
			)}
		</div>
	);
};

Checkbox.propTypes = {
	label: PropTypes.string,
	labelClassName: PropTypes.string,
	id: PropTypes.string.isRequired
};

export default Checkbox;
```

10. Let's enhance `breadCrumbs.tsx` with better path handling:

client/src/components/breadCrumbs.tsx

import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-react';
import { useId, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Group, GroupItem } from '@/components/ui/group';
import { Input } from '@/components/ui/input';

export type PasswordInputProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  disabled?: boolean;
};

const requirements = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[0-9]/, text: 'At least 1 number' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
];

export default function PasswordInput({
  value = '',
  onChange,
  id: idProp,
  disabled = false,
}: PasswordInputProps) {
  const id = useId();
  const inputId = idProp || id;
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(value);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) {
      return 'bg-border';
    }
    if (score <= 1) {
      return 'bg-red-500';
    }
    if (score <= 2) {
      return 'bg-orange-500';
    }
    if (score === 3) {
      return 'bg-amber-500';
    }
    return 'bg-emerald-500';
  };

  const getStrengthText = (score: number) => {
    if (score === 0) {
      return 'Enter a password';
    }
    if (score <= 2) {
      return 'Weak password';
    }
    if (score === 3) {
      return 'Medium password';
    }
    return 'Strong password';
  };

  const allRequirementsMet = strengthScore === 4;
  const shouldShowRequirements = value.length > 0 && !allRequirementsMet;

  return (
    <div>
      {/* Password input field with toggle visibility button */}
      <div className="*:not-first:mt-2">
        <Group className="w-full">
          <GroupItem
            className="flex-1"
            render={
              <Input
                aria-describedby={`${inputId}-description`}
                disabled={disabled}
                id={inputId}
                name="password"
                onChange={onChange}
                placeholder="Password"
                type={isVisible ? 'text' : 'password'}
                value={value}
              />
            }
          />
          <GroupItem
            render={
              <Button
                aria-controls="password"
                aria-label={isVisible ? 'Hide password' : 'Show password'}
                aria-pressed={isVisible}
                disabled={disabled}
                onClick={toggleVisibility}
                size="icon"
                type="button"
                variant="outline"
              />
            }
          >
            {isVisible ? (
              <EyeOffIcon aria-hidden="true" size={16} />
            ) : (
              <EyeIcon aria-hidden="true" size={16} />
            )}
          </GroupItem>
        </Group>
      </div>

      {/* Password strength indicator and requirements - only show if needed */}
      {shouldShowRequirements && (
        <>
          <div
            aria-label="Password strength"
            aria-valuemax={4}
            aria-valuemin={0}
            aria-valuenow={strengthScore}
            className="mt-3 mb-4 h-1 w-full overflow-hidden rounded-full bg-border"
            role="progressbar"
          >
            <div
              className={`h-full ${getStrengthColor(
                strengthScore
              )} transition-all duration-500 ease-out`}
              style={{ width: `${(strengthScore / 4) * 100}%` }}
            />
          </div>

          {/* Password strength description */}
          <p
            className="mb-2 font-medium text-foreground text-sm"
            id={`${id}-description`}
          >
            {getStrengthText(strengthScore)}. Must contain:
          </p>

          {/* Password requirements list */}
          <ul aria-label="Password requirements" className="space-y-1.5">
            {strength.map((req, index) => (
              <li className="flex items-center gap-2" key={index}>
                {req.met ? (
                  <CheckIcon
                    aria-hidden="true"
                    className="text-emerald-500"
                    size={16}
                  />
                ) : (
                  <XIcon
                    aria-hidden="true"
                    className="text-muted-foreground/80"
                    size={16}
                  />
                )}
                <span
                  className={`text-xs ${
                    req.met ? 'text-emerald-600' : 'text-muted-foreground'
                  }`}
                >
                  {req.text}
                  <span className="sr-only">
                    {req.met ? ' - Requirement met' : ' - Requirement not met'}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

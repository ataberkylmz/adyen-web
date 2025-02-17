import { Component, cloneElement, toChildArray, h, ComponentChild, VNode } from 'preact';
import classNames from 'classnames';
import './Field.scss';
import Spinner from '../../Spinner';
import Icon from '../../Icon';
import { FieldProps, FieldState } from './types';
import { getUniqueId } from '../../../../utils/idGenerator';
import { ARIA_ERROR_SUFFIX } from '../../../../core/Errors/constants';

class Field extends Component<FieldProps, FieldState> {
    private readonly uniqueId: string;

    constructor(props) {
        super(props);

        this.state = { focused: false };

        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);

        this.uniqueId = getUniqueId(`adyen-checkout-${this.props.name}`);
    }

    onFocus(e) {
        this.setState({ focused: true }, () => {
            if (this.props.onFocus) this.props.onFocus(e);
        });
    }

    onBlur(e) {
        this.setState({ focused: false }, () => {
            if (this.props.onBlur) this.props.onBlur(e);
            // When we also need to fire a specific function when a field blurs
            if (this.props.onFieldBlur) this.props.onFieldBlur(e);
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.focused !== undefined && nextProps.focused !== prevState.focused) {
            return { focused: nextProps.focused };
        }

        if (nextProps.filled !== undefined && nextProps.filled !== prevState.filled) {
            return { filled: nextProps.filled };
        }

        return null;
    }

    render({
        className = '',
        classNameModifiers = [],
        children,
        errorMessage,
        helper,
        inputWrapperModifiers = [],
        isLoading,
        isValid,
        label,
        dualBrandingElements,
        dir,
        name,
        showValidIcon,
        isCollatingErrors
    }) {
        return (
            <div
                className={classNames(
                    'adyen-checkout__field',
                    className,
                    classNameModifiers.map(m => `adyen-checkout__field--${m}`),
                    {
                        'adyen-checkout__field--error': errorMessage,
                        'adyen-checkout__field--valid': isValid
                    }
                )}
            >
                <label
                    onClick={this.props.onFocusField}
                    className={classNames({
                        'adyen-checkout__label': true,
                        'adyen-checkout__label--focused': this.state.focused,
                        'adyen-checkout__label--filled': this.state.filled,
                        'adyen-checkout__label--disabled': this.props.disabled
                    })}
                    htmlFor={name && this.uniqueId}
                >
                    {typeof label === 'string' && (
                        <span
                            className={classNames({
                                'adyen-checkout__label__text': true,
                                'adyen-checkout__label__text--error': errorMessage
                            })}
                        >
                            {label}
                        </span>
                    )}

                    {typeof label === 'function' && label()}

                    {helper && <span className={'adyen-checkout__helper-text'}>{helper}</span>}

                    <div
                        className={classNames([
                            'adyen-checkout__input-wrapper',
                            ...inputWrapperModifiers.map(m => `adyen-checkout__input-wrapper--${m}`)
                        ])}
                        dir={dir}
                    >
                        {toChildArray(children).map(
                            (child: ComponentChild): ComponentChild => {
                                const childProps = {
                                    isValid,
                                    onFocusHandler: this.onFocus,
                                    onBlurHandler: this.onBlur,
                                    isInvalid: !!errorMessage,
                                    ...(name && { uniqueId: this.uniqueId })
                                };
                                return cloneElement(child as VNode, childProps);
                            }
                        )}

                        {isLoading && (
                            <span className="adyen-checkout-input__inline-validation adyen-checkout-input__inline-validation--loading">
                                <Spinner size="small" />
                            </span>
                        )}

                        {isValid && showValidIcon !== false && !dualBrandingElements && (
                            <span className="adyen-checkout-input__inline-validation adyen-checkout-input__inline-validation--valid">
                                <Icon type="checkmark" />
                            </span>
                        )}

                        {errorMessage && (
                            <span className="adyen-checkout-input__inline-validation adyen-checkout-input__inline-validation--invalid">
                                <Icon type="field_error" />
                            </span>
                        )}
                    </div>

                    {errorMessage && errorMessage.length && (
                        <span
                            className={'adyen-checkout__error-text'}
                            id={`${this.uniqueId}${ARIA_ERROR_SUFFIX}`}
                            aria-hidden={isCollatingErrors ? 'true' : null}
                            aria-live={isCollatingErrors ? null : 'polite'}
                        >
                            {errorMessage}
                        </span>
                    )}
                </label>
            </div>
        );
    }
}

export default Field;

import React, { useEffect, useState } from 'react';
import { Config, ConnectEvents, Connect } from '@vkontakte/superappkit';

function App() {
    const [state, setState] = useState(null);
    useEffect(() => {
        const frame = document.querySelector('#vk-frame');

        Config.init({
            appId: 51441015, // Тут нужно подставить ID своего приложения.
            appSettings: {
                agreements: '',
                promo: '',
                vkc_behavior: '',
                vkc_auth_action: '',
                vkc_brand: '',
                vkc_display_mode: '',
            },
        });

        const oneTapButton = Connect.buttonOneTapAuth({
            callback: (event) => {
                const { type } = event;

                if (!type) {
                    return;
                }

                switch (type) {
                    case ConnectEvents.OneTapAuthEventsSDK.LOGIN_SUCCESS:
                        const { payload } = event;
                        setState(payload);

                        return false;
                    // Для этих событий нужно открыть полноценный VK ID чтобы
                    // пользователь дорегистрировался или подтвердил телефон
                    case ConnectEvents.OneTapAuthEventsSDK.FULL_AUTH_NEEDED: //  = 'VKSDKOneTapAuthFullAuthNeeded'
                    case ConnectEvents.OneTapAuthEventsSDK
                        .PHONE_VALIDATION_NEEDED: // = 'VKSDKOneTapAuthPhoneValidationNeeded'
                    case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN: // = 'VKSDKButtonOneTapAuthShowLogin'
                        console.log(event);
                        return Connect.redirectAuth({
                            url: 'https://privetmir.ru',
                            // state: 'dj29fnsadjsd82...',
                        }); // url - строка с url, на который будет произведён редирект после авторизации.
                    // state - состояние вашего приложение или любая произвольная строка, которая будет добавлена к url после авторизации.
                    // Пользователь перешел по кнопке "Войти другим способом"
                    case ConnectEvents.ButtonOneTapAuthEventsSDK
                        .SHOW_LOGIN_OPTIONS: // = 'VKSDKButtonOneTapAuthShowLoginOptions'
                        // Параметр screen: phone позволяет сразу открыть окно ввода телефона в VK ID
                        return Connect.redirectAuth({ screen: 'phone' });
                    default:
                        // Обработка остальных событий.
                        console.log(type);
                        return;
                }

                return null;
            },
            options: {
                showAlternativeLogin: false,
                showAgreements: true,
                showAgreementsDialog: false,
                displayMode: 'default',
                langId: 0,
                buttonSkin: 'flat',
                buttonStyles: {
                    borderRadius: 8,
                    height: 50,
                },
            },
        });

        if (oneTapButton && frame) {
            frame.append(oneTapButton.getFrame());
        }

        return () => {
            frame && oneTapButton && oneTapButton.destroy();
        };
    }, []);

    console.log(state);

    return (
        <>
            <div
                className="App"
                style={{ maxWidth: '500px', margin: '20px auto' }}
            >
                <span id="vk-frame" />
            </div>
            {state && (
                <>
                    <h3>Ответ VK сервера</h3>
                    <ul style={{ marginTop: '24px', listStyle: 'none' }}>
                        {Object.keys(state).map((el) => (
                            <li style={{ marginBottom: '18px' }}>
                                <span style={{ minWidth: '100px' }}>{el}</span>{' '}
                                :
                                <span style={{ marginLeft: '20px' }}>
                                    {state[el]}
                                </span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </>
    );
}
export default App;

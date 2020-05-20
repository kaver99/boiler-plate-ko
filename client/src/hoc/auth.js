import React, { useEffect } from 'react';
import Axios from 'axios';
// [REDUX]
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';


// SpecificComponent : 자격 인증에 포함되는 컴포넌트(LandingPage)
// option: null(아무나 출입 가능), true(로그인한 유저만 출입 가능), false(로그인한 유저는 출입 불가능한 페이지)
// adminRoute : amdin 자격을 가진 사용자만 사용 가능한 페이지인 경우에는 true, 그외 옵션 제외
export default function(SpecificComponent, option, adminRoute = null) {

    function AuthenticationCheck(props) {
        // Back-End에 사용자의 상태를 우선 요청
        // [REDUX]
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response => {
                console.log(response)
                // 로그인 하지 않은 상태
                if(!response.payload.isAuth) {
                    if(option) {
                        props.history.push('/login');
                    }
                } else {
                    // 관리자 페이지에 관리자 자격이 없는 사용자가 접근 시
                    if(adminRoute && !response.payload.isAdmin) {
                        props.history.push('/');
                    } else {
                        // 로그인 한 사용자가 출입 불가능한 페에지 접근 시
                        if(option === false) {
                            props.history.push('/');
                        }
                    }
                }

            });
        }, []);
        return (
            <SpecificComponent />
        );
    } 

    return AuthenticationCheck;
}
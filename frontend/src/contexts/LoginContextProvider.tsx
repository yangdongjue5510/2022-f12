import { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react';

const initialState: UserData = {
  member: {
    id: null,
    gitHubId: null,
    imageUrl: null,
    name: null,
    followerCount: null,
    following: null,
  },
  registerCompleted: false,
  token: null,
};

export const IsLoggedInContext = createContext<boolean>(false);
export const UserDataContext = createContext(initialState);
export const SetUserDataContext = createContext<React.Dispatch<
  React.SetStateAction<UserData>
> | null>(null);
export const LogoutContext = createContext<() => void | null>(null);

function LoginContextProvider({ children }: PropsWithChildren) {
  const [userData, setUserData] = useState<UserData>(null);
  const checkLoginStatus = () => {
    return userData && !!userData.token;
  };

  const [isLoggedIn, setLoggedIn] = useState<boolean>(checkLoginStatus());
  // 토큰이 중간에 변경되더라도 존재 여부가 바뀌지 않으면 변경되지 않도록 설정
  //생략하면 토큰이 변경되면 로그인 상태를 다시 설정
  const hasToken = useMemo(() => !!userData?.token, [userData]);

  const handleLogout = () => {
    setUserData(null);
  };

  useEffect(() => {
    setLoggedIn(checkLoginStatus());
  }, [hasToken]);

  return (
    <IsLoggedInContext.Provider value={isLoggedIn}>
      <UserDataContext.Provider value={userData}>
        <SetUserDataContext.Provider value={setUserData}>
          <LogoutContext.Provider value={handleLogout}>{children}</LogoutContext.Provider>
        </SetUserDataContext.Provider>
      </UserDataContext.Provider>
    </IsLoggedInContext.Provider>
  );
}

export default LoginContextProvider;

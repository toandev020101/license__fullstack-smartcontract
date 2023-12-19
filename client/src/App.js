import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Fragment, useContext, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Error from './components/Error';
import ClientLayout from './layouts/ClientLayout';
import { privateRoutes, publicRoutes } from './routes';
import JWTManager from './utils/jwt';
import { AuthContext } from './contexts/authContext';

const App = () => {
  const theme = createTheme();
  const { _isLogined, setIsLogined } = useContext(AuthContext);

  useEffect(() => {
    const isLogin = async () => {
      try {
        const token = JWTManager.getToken();
        if (!token) {
          const success = await JWTManager.getRefreshToken();
          setIsLogined(success);
        } else {
          setIsLogined(true);
        }
      } catch (error) {
        const { data } = error.response;
        console.error(data);
        setIsLogined(false);
      }
    };

    isLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/error/401" element={<Error type={401} />} />
            <Route path="/error/403" element={<Error type={403} />} />
            <Route path="/error/404" element={<Error type={404} />} />
            <Route path="/error/500" element={<Error type={500} />} />

            {privateRoutes.map((route, index) => {
              const Page = route.component;

              let Layout = ClientLayout;

              if (route.layout) {
                Layout = route.layout;
              } else if (route.layout === null) {
                Layout = Fragment;
              }

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}

            {publicRoutes.map((route, index) => {
              const Page = route.component;

              let Layout = ClientLayout;

              if (route.layout) {
                Layout = route.layout;
              } else if (route.layout === null) {
                Layout = Fragment;
              }

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}

            <Route path="*" element={<Error type={404} />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;

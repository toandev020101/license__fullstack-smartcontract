import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Fragment } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Error from './components/Error';
import ClientLayout from './layouts/ClientLayout';
import { privateRoutes, publicRoutes } from './routes';

const App = () => {
  const theme = createTheme();

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

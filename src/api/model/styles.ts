export const HTML_MOBILE_LAYOUT_CLASS = 'devas-platform-mobile-layout';
export const HTML_LARGE_SCREEN_LAYOUT_CLASS = 'devas-platform-large-screen-layout';
export const HTML_DARK_THEME_CLASS = 'devas-platform-app-dark';

export const MOBILE_MEDIA_QUERY = '(max-width: 700px)';
export const LARGE_SCREEN_MEDIA_QUERY = '(min-width: 1400px)';

// Only for tables heights. Manual set
// export const TABLE_BASE_HEIGHT = '55vh';
// export const MOBILE_TABLE_BASE_HEIGHT = '70vh';
export const TABLE_BASE_SCROLL_HEIGHT = `calc(100vh - 266px)`;
export const MOBILE_TABLE_BASE_SCROLL_HEIGHT = `calc(70vh - 7px)`;

export const THEME_STORAGE_KEY = 'devasPlatformAppTheme';
export const LIGHT_THEME_VALUE = 'devasPlatformAppLight';
export const DARK_THEME_VALUE = 'devasPlatformAppDark';

export enum AppColors {
    //Dark theme
    BlackBackgroundColor = 'black',
    DarkBackgroundColor1 = '#001529',
    DarkBackgroundColor2 = '#002140',
    // DarkBackgroundColor3 = '#3c3f65',
    DarkThemeTextColor1 = '#bebebe',

    //WhiteTheme
    WhiteBackgroundColor = 'white',
    LightBackgroundColor1 = '#f0f2f5',

    //Common
    AntBlueColor = '#1890ff',
    AntRedColor = '#ff4d4f'
};

export interface IAppTheme {
    blackBackgroundColor?: string;
    darkBackgroundColor1?: string;
    darkBackgroundColor2?: string;
    darkThemeTextColor1?: string;
    whiteBackgroundColor?: string;
    lightBackgroundColor1?: string;
    antBlueColor?: string;
    antRedColor?: string;
    dark: boolean;
};

export const DARK_THEME: IAppTheme = {
    blackBackgroundColor: AppColors.BlackBackgroundColor,
    darkBackgroundColor1: AppColors.DarkBackgroundColor1,
    darkBackgroundColor2: AppColors.DarkBackgroundColor2,
    darkThemeTextColor1: AppColors.DarkThemeTextColor1,
    whiteBackgroundColor: AppColors.WhiteBackgroundColor,
    antBlueColor: AppColors.AntBlueColor,
    antRedColor: AppColors.AntRedColor,
    dark: true
};

export const LIGHT_THEME: IAppTheme = {
    whiteBackgroundColor: AppColors.WhiteBackgroundColor,
    lightBackgroundColor1: AppColors.LightBackgroundColor1,
    antBlueColor: AppColors.AntBlueColor,
    antRedColor: AppColors.AntRedColor,
    dark: false
};

class Helper {
  static getDevice(userAgent: string): string {
    return (/android/i.test(userAgent))
      ? 'android'
      : (/iPad|iPhone|iPod/.test(userAgent))
        ? 'ios'
        : 'desktop';
  }
}

export default Helper;

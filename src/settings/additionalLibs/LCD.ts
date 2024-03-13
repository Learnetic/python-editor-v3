export default  `
from microbit import *

LCD_I2C_ADDR=39

class LCD():
    def __init__(self):
        self.buf = bytearray(1)
        self.BK = 0x08
        self.RS = 0x00
        self.E = 0x04
        self.setcmd(0x33)
        sleep(5)
        self.send(0x30)
        sleep(5)
        self.send(0x20)
        sleep(5)
        self.setcmd(0x28)
        self.setcmd(0x0C)
        self.setcmd(0x06)
        self.setcmd(0x01)
        self.version='1.0'

    def setReg(self, dat):
        self.buf[0] = dat
        i2c.write(LCD_I2C_ADDR, self.buf)
        sleep(1)

    def send(self, dat):
        d=dat&0xF0
        d|=self.BK
        d|=self.RS
        self.setReg(d)
        self.setReg(d|0x04)
        self.setReg(d)

    def setcmd(self, cmd):
        self.RS=0
        self.send(cmd)
        self.send(cmd<<4)

    def setdat(self, dat):
        self.RS=1
        self.send(dat)
        self.send(dat<<4)

    def clear(self):
        self.setcmd(1)

    def backlight(self, on):
        if on:
            self.BK=0x08
        else:
            self.BK=0
        self.setcmd(0)

    def on(self):
        self.setcmd(0x0C)

    def off(self):
        self.setcmd(0x08)

    def shl(self):
        self.setcmd(0x18)

    def shr(self):
        self.setcmd(0x1C)
    
        
    def char(self, ch, x=-1, y=0):
        if x>=0:
            a=0x80
            if y>0:
                a=0xC0
            a+=x
            self.setcmd(a)
        self.setdat(ch)


    def print_variable(self, variable, x=0, y=0):
        self.print(str(variable), x, y)
    accelerometer.get_x()
    
    def print(self, s, x=0, y=0):
        if len(s)>0:
            self.char(ord(s[0]),x,y)
            for i in range(1, len(s)):
                self.char(ord(s[i]))

    def create_custom_char(self, pattern, char_num):
        if char_num < 8:
            self.setcmd(0x40 + char_num * 8)
            for i in range(8):
                self.setdat(pattern[i])

    # Dodana funkcja do rysowania własnego znaku
    def draw(self, pattern, x, y, z=0):
        char_num = z  # Możesz dostosować numer znaku niestandardowego (0-7)
        self.create_custom_char(pattern, char_num)
        self.char(char_num, x, y)


    def scroll_text(self, text, delay=150, direction='left'):
        """
        Scrolls the text on the LCD with a scrolling animation.

        :param text: The text to scroll.
        :param delay: The delay between scrolls (default: 150 milliseconds).
        :param direction: The direction of the scroll, 'left' or 'right' (default: 'left').
        """
        if direction not in ['left', 'right']:
            raise ValueError("Invalid direction. Use 'left' or 'right'.")

        for i in range(len(text) + 16):
            self.clear()

            if direction == 'left':
                offset = min(i, len(text))
                self.print(text[offset:], 0, 0)
            elif direction == 'right':
                offset = max(0, len(text) - i)
                self.print(text[:len(text) - offset], offset, 0)

            sleep(delay)
`
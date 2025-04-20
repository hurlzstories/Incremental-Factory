import tkinter as tk
from tkinter import messagebox

class Game:
    def __init__(self, master):
        self.master = master
        master.title("Factory Game")

        self.has_first_machine = False
        self.upgrade_choice = None
        self.upgrade_bought = False

        self.factory_button = tk.Button(master, text="Buy Factory", command=self.buy_factory)
        self.factory_button.pack()

        self.upgrade_button = None  # Will be created after the first upgrade choice

        self.status_bar_label = tk.Label(master, text="[]")
        self.status_bar_label.pack()

    def buy_factory(self):
        if not self.has_first_machine:
            self.has_first_machine = True
            self.show_upgrade_choice()
        else:
            messagebox.showinfo("Factory", "You already have a factory!")

    def show_upgrade_choice(self):
        choice = messagebox.askquestion("First Upgrade", "Choose your first upgrade: Triangle for Speed Buff or Circle for Production Buff?")
        if choice == 'yes':
            self.upgrade_choice = "triangle"
            self.create_upgrade_button()
        elif choice == 'no':
            self.upgrade_choice = "circle"
            self.create_upgrade_button()
        else:
            # Handle cases where the user closes the dialog without choosing
            messagebox.showinfo("Info", "No upgrade selected.")

    def create_upgrade_button(self):
        self.upgrade_button = tk.Button(self.master, text="Buy Upgrade", command=self.buy_upgrade)
        self.upgrade_button.pack()

    def buy_upgrade(self):
        if not self.upgrade_bought and self.upgrade_choice:
            self.upgrade_bought = True
            self.update_status_bar()
            if self.upgrade_button:
                self.upgrade_button.destroy() # Remove the button after purchase
            messagebox.showinfo("Upgrade", f"You bought the {self.upgrade_choice} upgrade!")
        elif self.upgrade_bought:
            messagebox.showinfo("Upgrade", "You have already bought the first upgrade.")
        else:
            messagebox.showinfo("Upgrade", "Please choose an upgrade first.")

    def update_status_bar(self):
        symbol = ""
        if self.upgrade_choice == "triangle":
            symbol = "△"
        elif self.upgrade_choice == "circle":
            symbol = "○"
        self.status_bar_label.config(text=f"[□{symbol}]")

root = tk.Tk()
game = Game(root)
root.mainloop()

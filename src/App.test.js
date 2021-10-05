import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

const longText =
  "It began with the forging of the Great Rings. Three were given to the Elves, immortal, wisest and fairest of all beings. Seven to the Dwarf-Lords, great miners and craftsmen of the mountain halls. And nine, nine rings were gifted to the race of Men, who above all";

describe("Basic app functionality", () => {
  it("Renders the app", () => {
    render(<App />);
    expect(screen.getByText("Text to tweetify:")).toBeInTheDocument();
  });

  it("Should not have an instant response to a typed message", () => {
    render(<App />);

    userEvent.type(screen.getByRole("textbox"), "Hello World!");

    expect(screen.getByRole("textbox")).toHaveValue("Hello World!");
    expect(screen.getByTestId("output")).toBeEmptyDOMElement();
  });

  it("Should add a hashtag to a simple english sentence", async () => {
    render(<App />);

    userEvent.type(screen.getByRole("textbox"), "Hello World!");

    expect(await screen.findByText("Hello World! #tomato")).toBeInTheDocument();
  });

  it("Should not add a hashtag to a simple english sentence if it already has one", async () => {
    render(<App />);

    userEvent.type(screen.getByRole("textbox"), "#tomato Hello World!");

    expect(await screen.findByText("#tomato Hello World!")).toBeInTheDocument();
  });
});

describe("Text that is longer than 140 characters functionality", () => {
  it("Should trim a tweet that's longer than 140 characters and add a hashtag to it", async () => {
    render(<App />);

    userEvent.type(screen.getByRole("textbox"), longText);

    expect(
      await screen.findByText(longText.slice(0, 132) + " #tomato")
    ).toBeInTheDocument();
  });

  it("Should trim a tweet that's longer than 140 characters and has a hashtag to it before the limit", async () => {
    render(<App />);

    const customText = "#tomato " + longText;
    userEvent.type(screen.getByRole("textbox"), customText);

    expect(
      await screen.findByText(customText.slice(0, 140))
    ).toBeInTheDocument();
  });

  it("Should trim a tweet that's longer than 140 characters and keep the hashtag, in which the hashtag is present after the limit", async () => {
    render(<App />);

    const longTextWithHashTag = longText + " #tomato";
    userEvent.type(screen.getByRole("textbox"), longTextWithHashTag);

    expect(
      await screen.findByText(longText.slice(0, 132) + " #tomato")
    ).toBeInTheDocument();
  });

  it("Should trim a tweet that's longer than 140 characters and keep the hashtag, in which the hashtag starts before and finishes after the limit", async () => {
    render(<App />);

    const longTextWithHashTagOverflowing = longText.slice(0, 134) + " #tomato";
    userEvent.type(screen.getByRole("textbox"), longTextWithHashTagOverflowing);

    expect(
      await screen.findByText(longText.slice(0, 132) + " #tomato")
    ).toBeInTheDocument();
  });
});

describe("Language detection", () => {
  const italianText =
    "Il Vicolo della Scrofa, per chi conosce Roma, è una delle stradine più caratteristiche e ricche di simboli. Proprio in una trattoria di questa strada, da cui il nome del vicolo, pare sia stata realizzata la prima Carbonara, nel 1944.";

  const dutchText =
    "Alle adressen van de gemeente vindt u in de adressengids. Bijvoorbeeld Afvalpunten en het Sociaal Loket.";

  it("Should add #pomodoro to an italian text", async () => {
    render(<App />);

    userEvent.type(screen.getByRole("textbox"), italianText);

    expect(
      await screen.findByText(italianText.slice(0, 130).trim() + " #pomodoro")
    ).toBeInTheDocument();
  });

  it("Should recognize #pomodoro as a valid hashtag and trim the text", async () => {
    render(<App />);

    const customText = "#pomodoro " + italianText;
    userEvent.type(screen.getByRole("textbox"), customText);

    expect(
      await screen.findByText(customText.slice(0, 140))
    ).toBeInTheDocument();
  });

  it("Should add #tomaat to a dutch text", async () => {
    render(<App />);

    userEvent.type(screen.getByRole("textbox"), dutchText);

    expect(
      await screen.findByText(dutchText.slice(0, 132) + " #tomaat")
    ).toBeInTheDocument();
  });

  it("Should recognize #tomaat as a valid hashtag and trim the text", async () => {
    render(<App />);

    const customText = "#tomaat " + dutchText;
    userEvent.type(screen.getByRole("textbox"), customText);

    expect(
      await screen.findByText(customText.slice(0, 140))
    ).toBeInTheDocument();
  });

  it("Should recognize #pomidor as a valid hashtag and trim the text", async () => {
    render(<App />);

    const customText = "#pomidor " + dutchText;
    userEvent.type(screen.getByRole("textbox"), customText);

    expect(
      await screen.findByText(customText.slice(0, 140))
    ).toBeInTheDocument();
  });
});

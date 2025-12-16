/**
 * TOC - Latest Industry Updates Backend
 * Fetches recent tweets from a fixed list of Twitter accounts
 * Filters only relevant casino, sportsbook, poker, gaming updates
 * © TOC 2025
 */

import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// --------------------------------------------
// 1️⃣  Twitter API Credentials
// --------------------------------------------
const BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAFKf6AEAAAAAGvH76bTGxVAcY5HYWTxmmM7V%2BIA%3DBY5urX8yqxOn6PLcnu7wpydGjykbW0xEdhAjsv847nWSBm8dQO"; // replace with your real token

// --------------------------------------------
// 2️⃣  Fixed list of Twitter accounts (usernames only, no @)
// --------------------------------------------
const ACCOUNTS = [
  "_Collin1", "AaronKessler", "AaronSchatz", "abbypoker_", "AdamBurke",
  "AdamChernoff", "AdamKramer", "AdamLevitan", "AlanBerg", "AlexKane",
  "alexscott72o", "AlfonsoStraffon", "AndyMolitor", "apestyles", "ArielEpstein",
  "BarstoolBigCat", "BeatingTheBook", "BenFawkes", "BenjaminSolak", "BigCat",
  "BillKrackomberger", "BobStoll", "BradEvans", "BrandonAnderson", "BrentMusburger",
  "brettskireal", "brynkenney", "CabbieRichards", "cabrzytv", "camzillapoker",
  "CaptainJack2000", "ch1llys", "ChadMillman", "chipmonkz", "ChrisAltruda",
  "ChrisAndrews", "ChrisBennett", "ChrisFallica", "ChrisFargis", "ChrisGrove",
  "ChrisRaybon", "CircaSports", "ColbyMBets", "ConnorAllen", "CousinSal",
  "crownupguy", "DanoMataya", "DarrenRovell", "DaveFarra", "DaveMasonBOL",
  "DaveTuley", "DavidBearman", "DavidPurdum", "DeepDivePod", "DividendBlower",
  "DougKezirian", "DrewDinsick", "EataHoagie", "EdFeng", "EdMiller", "EdSalmons",
  "EliHershkovich", "ErikBeimfohr", "ErinKDolan", "ESPNStatsInfo", "EvanSilva",
  "ExtraPointsPod", "FabianSommer", "FDSportsbook", "francinemarie", "GrantNeiffer",
  "griffinbenger", "GUnit_81", "HammerDAHN", "HardwoodParoxysm", "HeedTheseTakes",
  "hideousslots", "Hitman", "HowardStutz", "IanWharton", "IGN", "IncarceratedBob",
  "itsvegasmatt", "jackiburkhart81", "JamesHolzhauer", "JasonLogan", "jasonschreier",
  "JayCuda", "JayKornegay", "JeffBenson", "JeffDavisHockey", "JeffMa", "JeffSherman",
  "JimmyVaccaro", "JJApricena", "JoeBrennanJr", "JoeFortenbaugh", "JoeOsborne",
  "JoeOstrowski", "JoePeta", "JoeyOddessa", "JoeyTunes", "JohnBrennan", "JohnHolden",
  "JohnJastremski", "JohnMehaffey", "JohnMurrayLV", "JohnSheeran", "jonathanlittle",
  "JonnyReno", "JonSpevack", "JoshADHD", "JoshApplebaum", "JoshInglis", "KellyInVegas",
  "KenBarkley", "KenPomeroy", "mattstaplespkr", "nanonoko", "ngslot", "pokerface_ash_",
  "RobinPoker_", "Shaggy_Bets", "Slasher", "slickricpoker", "spinlifetv", "StephieSmallls",
  "SweatpantJesus", "thebigjackpot", "ToddFuhrman", "tonyguoga", "Vsaaauce", "wolfgangpoker",
  "zachbruch"
];

// --------------------------------------------
// 3️⃣  Keywords to match relevant tweets
// --------------------------------------------
const KEYWORDS = [
  "casino", "sportsbook", "bet", "betting", "odds", "lines",
  "parlay", "poker", "slots", "gaming", "jackpot", "tournament"
];

// --------------------------------------------
// 4️⃣  Helper: Fetch user ID by username
// --------------------------------------------
async function getUserId(username) {
  const res = await fetch(`https://api.twitter.com/2/users/by/username/${username}`, {
    headers: { Authorization: `Bearer ${BEARER_TOKEN}` }
  });
  const data = await res.json();
  return data.data?.id || null;
}

// --------------------------------------------
// 5️⃣  Helper: Fetch tweets by user ID
// --------------------------------------------
async function getUserTweets(userId, hours = 12) {
  const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
  const url = `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.f_

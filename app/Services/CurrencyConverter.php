<?php
namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config;

class CurrencyConverter
{
    protected string $apiUrl;
    protected string $accessKey;
    protected int $cacheDuration = 60 * 12; // 12 hours

    public function __construct()
    {
        $this->apiUrl = Config::get('services.exchange.api_url');
        $this->accessKey = Config::get('services.exchange.access_key');
    }

    public function getConversionRate(string $from, string $to): float
    {
        if ($from === $to) {
            return 1.0;
        }

        $rates = $this->getCachedRates();

        $rateFrom = $rates[$from] ?? null;
        $rateTo = $rates[$to] ?? null;

        if (!$rateFrom || !$rateTo) {
            throw new \Exception("Unsupported currency: $from or $to");
        }

        $conversionRate = $rateTo / $rateFrom;

        return $conversionRate + 0.01; // apply spread
    }

    protected function getCachedRates(): array
    {
        return Cache::remember('currency_rates', $this->cacheDuration, function () {
            try {
                $response = Http::retry(3, 100)->get($this->apiUrl, [
                    'access_key' => $this->accessKey,
                    'symbols' => 'USD,EUR,GBP',
                    'format' => 1,
                ]);
    
                if (!$response->ok() || !isset($response['rates'])) {
                    throw new \Exception('Invalid API response structure.');
                }
    
                return $response['rates'];
    
            } catch (\Throwable $e) {
                // Log the error for debugging
                Log::error('CurrencyConverter API failed', [
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
    
                throw new \Exception('Unable to fetch currency rates. Please try again later.');
            }
        });
    }
}